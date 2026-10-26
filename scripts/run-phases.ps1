#Requires -Version 5.1
<#
.SYNOPSIS
    Runs MMEC site phases 2 to 7 with Claude Code in headless mode, one fresh session per phase.

.DESCRIPTION
    For each phase the script:
      1. checks that the working tree is clean and updates main;
      2. runs Claude Code with the Prompt section of docs/phases/NN-*.md plus unattended-run rules;
      3. finds the pull request, checks the reviewer verdict in its description, waits for CI;
      4. merges it (squash) unless the phase is a human gate (3, 4 and 7), where it stops.

    Phase 0 and 1 are already done. Phase 8 (cutover) is never run by this script.
    The script never changes repository settings and never deploys to production.

.PARAMETER From
    First phase to run (2 to 7).

.PARAMETER To
    Last phase to run (2 to 7). The script stops earlier at the first human gate.

.PARAMETER ApproveFirst
    Merge the open pull request of phase (From - 1) before starting. Use it after you have
    reviewed a gated phase.

.PARAMETER PermissionMode
    Value for claude --permission-mode. Default: auto. Deny rules in .claude/settings.json
    still apply (no merge, no push to main, no deploy).

.PARAMETER Model
    Optional model alias for claude --model (for example sonnet or opus).

.EXAMPLE
    .\scripts\run-phases.ps1 -From 2 -To 7
    Runs phase 2 (merged automatically) and phase 3, then stops for your review.

.EXAMPLE
    .\scripts\run-phases.ps1 -From 4 -To 7 -ApproveFirst
    Merges the phase 3 pull request, runs phase 4, then stops for your review.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][ValidateRange(2, 7)][int]$From,
    [Parameter(Mandatory = $true)][ValidateRange(2, 7)][int]$To,
    [switch]$ApproveFirst,
    [string]$PermissionMode = 'auto',
    [string]$Model = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
try {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    $OutputEncoding = $utf8
    [Console]::OutputEncoding = $utf8
} catch {
    # Some hosts do not allow changing the console encoding; continue.
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path (Split-Path -Parent $RepoRoot) 'mmec-phase-logs'
$GatedPhases = @(3, 4, 7)

$CommonRules = @'
UNATTENDED RUN RULES (set by the owner; they override any instruction in the phase file to ask or wait):
- Do not ask questions. Take the documented default for any open item, record it in docs/open-questions.md and list it in the PR description under "Needs a human decision".
- Before opening the pull request, run the reviewer agent, fix every blocking finding, and paste the final verdict (APPROVE, APPROVE WITH NOTES or CHANGES REQUESTED) into the PR description under "Reviewer agent verdict".
- Open the pull request and stop. Never merge, never push to main, never deploy, never change repository or Cloudflare settings.
- If a step needs an action only the owner can do (login, token, DNS, verification code), complete everything else, open the pull request, and print one line per step starting with NEEDS_OWNER: followed by the exact steps.
- If you cannot finish, print one line starting with BLOCKED: followed by the reason, and stop.
'@

$PhaseExtras = @{
    2 = @'
PHASE 2 DECISIONS FROM THE OWNER:
- Heading case: use mixed case by default and implement it as a single design token (and a single place in the specimen page) so it can be switched in one step. Show the upper case variant on the specimen page for comparison.
- Strip the C2PA / content-credential metadata from every SVG and PNG copied from the brand folder, keeping the artwork identical (verify visually or by rendering and comparing). Record it in the PR.
- Keep the favicon provisional and note it in docs/open-questions.md.
'@
    3 = @'
PHASE 3 DECISIONS FROM THE OWNER:
- Update the site description in the shared site config (src/) to: "Escritorio de advocacia em Brasilia com atuacao em direito da radiodifusao, incluindo regulacao e acompanhamento institucional." Write it with the correct Portuguese accents. Before doing so, check docs/content-sources.md (H-02) and confirm that "regulacao" and "acompanhamento institucional" appear in the legacy source text; if they do not, remove them and say so in the PR description.
- Use the final owner answers in docs/open-questions.md: both phone numbers (WhatsApp only on (61) 3879-5003), postcode 71.615-560, footer line "OAB/DF 0100104RS", no "Desenvolvido por" credit, "Desde 2004" without a counter.
'@
    4 = @'
PHASE 4 DECISIONS FROM THE OWNER:
- Use the final owner answers in docs/open-questions.md. Keep all three publications online, labelled with year and type; adding a new edition (for example a 2027 calendar) must be a content-only change.
- The calendar PDF stays unchanged at the same URL; record the outdated letterhead as a known issue.
'@
    5 = @'
PHASE 5 DECISIONS FROM THE OWNER:
- Analytics decision is made: Cloudflare Web Analytics (cookieless, no banner) plus Google Search Console. No GA4, no Clarity. Do not wait for a decision: write docs/decisions/0003-analytics.md with this decision (status accepted by the owner), compare the options briefly, and verify in the official Cloudflare docs what the dashboard shows and what CSP changes are needed. Include in the PR what it does not measure (for example PDF download events).
- Security contact for security.txt: the contact email in the site config (see Q-03 in docs/open-questions.md).
- Search Console verification and the Cloudflare Web Analytics site token need the owner: print NEEDS_OWNER lines for them.
'@
    6 = ''
    7 = ''
}

function Stop-Run {
    param([string]$Message)
    Write-Host ''
    Write-Host "STOPPED: $Message" -ForegroundColor Red
    exit 1
}

function Invoke-Native {
    param([string]$Exe, [string[]]$Arguments)
    & $Exe @Arguments
    if ($LASTEXITCODE -ne 0) {
        Stop-Run "Command failed: $Exe $($Arguments -join ' ') (exit code $LASTEXITCODE)"
    }
}

function Get-PhaseFile {
    param([int]$Number)
    $found = @(Get-ChildItem -Path (Join-Path $RepoRoot 'docs\phases') -Filter ('{0:D2}-*.md' -f $Number))
    if ($found.Count -ne 1) { Stop-Run "Phase file for phase $Number not found." }
    return $found[0]
}

function Get-PhasePrompt {
    param([System.IO.FileInfo]$File)
    $text = Get-Content -Path $File.FullName -Raw
    if ($text -match '(?s)## Prompt\s+```\r?\n(.*?)\r?\n```') { return $Matches[1].Trim() }
    Stop-Run "No Prompt section in $($File.Name)."
}

function Get-PhaseBranch {
    param([string]$Prompt)
    if ($Prompt -match 'on branch ([\w./-]+)') { return $Matches[1].TrimEnd('.') }
    Stop-Run 'No branch name in the phase prompt.'
}

function Get-HumanGate {
    param([System.IO.FileInfo]$File)
    $text = Get-Content -Path $File.FullName -Raw
    if ($text -match '(?s)## Human gate\s+(.*)$') { return $Matches[1].Trim() }
    return ''
}

function Get-OpenPr {
    param([string]$Branch)
    $json = & gh pr list --head $Branch --state open --json number,url,body --limit 1
    if ($LASTEXITCODE -ne 0) { Stop-Run 'gh pr list failed. Check gh auth status.' }
    $items = @($json | ConvertFrom-Json)
    if ($items.Count -eq 0) { return $null }
    return $items[0]
}

function Wait-Checks {
    param([int]$Number)
    Start-Sleep -Seconds 30
    for ($i = 0; $i -lt 6; $i++) {
        & gh pr checks $Number --watch --interval 20
        $code = $LASTEXITCODE
        if ($code -eq 0) { return }
        if ($code -eq 1) { Stop-Run "A check failed on PR #$Number. Open the PR and read the log." }
        Start-Sleep -Seconds 30
    }
    Stop-Run "Checks on PR #$Number did not finish."
}

function Assert-Verdict {
    param($Pr)
    $body = [string]$Pr.body
    if ($body -notmatch '(?i)APPROVE') { Stop-Run "PR #$($Pr.number) has no APPROVE verdict in its description. Read it: $($Pr.url)" }
    if ($body -match '(?i)CHANGES REQUESTED') { Stop-Run "PR #$($Pr.number) mentions CHANGES REQUESTED. Read it: $($Pr.url)" }
}

function Merge-Pr {
    param([int]$Number)
    Invoke-Native 'gh' @('pr', 'merge', "$Number", '--squash', '--delete-branch')
    Invoke-Native 'git' @('checkout', 'main')
    Invoke-Native 'git' @('pull', '--ff-only')
}

function Initialize-Main {
    $dirty = & git status --porcelain
    if ($LASTEXITCODE -ne 0) { Stop-Run 'git status failed.' }
    if ($dirty) { Stop-Run 'The working tree has uncommitted changes. Commit or discard them first.' }
    Invoke-Native 'git' @('checkout', 'main')
    Invoke-Native 'git' @('pull', '--ff-only')
}

function Approve-Phase {
    param([int]$Number)
    $file = Get-PhaseFile $Number
    $branch = Get-PhaseBranch (Get-PhasePrompt $file)
    $pr = Get-OpenPr $branch
    if ($null -eq $pr) {
        Write-Host "No open pull request for phase $Number (branch $branch). Assuming it is already merged." -ForegroundColor Yellow
        return
    }
    Write-Host "Approving phase ${Number}: PR #$($pr.number) $($pr.url)" -ForegroundColor Cyan
    Assert-Verdict $pr
    Wait-Checks $pr.number
    Merge-Pr $pr.number
}

function Invoke-Phase {
    param([int]$Number)

    $file = Get-PhaseFile $Number
    $phasePrompt = Get-PhasePrompt $file
    $branch = Get-PhaseBranch $phasePrompt
    $started = Get-Date

    Write-Host ''
    Write-Host "=== Phase $Number ($($file.BaseName)) on branch $branch ===" -ForegroundColor Cyan

    Initialize-Main

    $existing = Get-OpenPr $branch
    if ($null -ne $existing) { Stop-Run "An open PR already exists for $branch ($($existing.url)). Review or close it first." }

    $prompt = $phasePrompt + "`n`n" + $CommonRules
    if ($PhaseExtras[$Number]) { $prompt += "`n`n" + $PhaseExtras[$Number] }

    New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
    $log = Join-Path $LogDir ('phase-{0:D2}-{1}.log' -f $Number, (Get-Date -Format 'yyyyMMdd-HHmmss'))

    $claudeArgs = @('-p', '--permission-mode', $PermissionMode)
    if ($Model) { $claudeArgs += @('--model', $Model) }

    Write-Host "Running Claude Code (log: $log). This can take 20 to 40 minutes."
    $output = $prompt | & claude @claudeArgs 2>&1 | Tee-Object -FilePath $log | ForEach-Object { Write-Host $_; $_ }
    if ($LASTEXITCODE -ne 0) {
        Stop-Run "Claude Code exited with code $LASTEXITCODE. If the usage limit was reached, wait for the reset and run the same command again. Log: $log"
    }
    $text = ($output | Out-String)

    $blocked = [regex]::Matches($text, '(?m)^\s*BLOCKED:.*$')
    if ($blocked.Count -gt 0) {
        Write-Host ''
        foreach ($m in $blocked) { Write-Host $m.Value.Trim() -ForegroundColor Red }
        Stop-Run "Phase $Number reported BLOCKED."
    }

    $pr = Get-OpenPr $branch
    if ($null -eq $pr) { Stop-Run "No pull request was opened for $branch. Read the log: $log" }
    Write-Host "Pull request: $($pr.url)" -ForegroundColor Green

    $owner = [regex]::Matches($text, '(?m)^\s*NEEDS_OWNER:.*$')
    if ($owner.Count -gt 0) {
        Write-Host ''
        Write-Host 'Owner actions needed before this phase can be merged:' -ForegroundColor Yellow
        foreach ($m in $owner) { Write-Host $m.Value.Trim() -ForegroundColor Yellow }
        Write-Host "PR left open: $($pr.url)"
        Write-Host "When done, run: .\scripts\run-phases.ps1 -From $($Number + 1) -To $To -ApproveFirst"
        exit 0
    }

    Assert-Verdict $pr
    Wait-Checks $pr.number

    if ($GatedPhases -contains $Number) {
        $elapsed = [int]((Get-Date) - $started).TotalMinutes
        Write-Host ''
        Write-Host "HUMAN GATE after phase $Number (took $elapsed min). PR is open and CI is green: $($pr.url)" -ForegroundColor Yellow
        Write-Host 'Review (from the phase file):'
        Write-Host (Get-HumanGate $file)
        Write-Host ''
        Write-Host 'To request changes: comment on the PR, or fix it with an interactive claude session on the branch and push.'
        if ($Number -lt 7) {
            Write-Host "To approve and continue: .\scripts\run-phases.ps1 -From $($Number + 1) -To 7 -ApproveFirst"
        } else {
            Write-Host 'After your written go in the PR: merge it with gh pr merge, then start Phase 8 by hand in an interactive session.'
        }
        exit 0
    }

    Merge-Pr $pr.number
    $elapsed = [int]((Get-Date) - $started).TotalMinutes
    Write-Host "Phase $Number merged (took $elapsed min)." -ForegroundColor Green
}

# --- main ---
Set-Location $RepoRoot

foreach ($tool in @('git', 'gh', 'claude')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { Stop-Run "$tool is not installed or not in PATH." }
}
& gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Stop-Run 'gh is not logged in. Run: gh auth login' }

if ($From -gt $To) { Stop-Run '-From must be less than or equal to -To.' }

if ($ApproveFirst) {
    if ($From -le 2) { Stop-Run '-ApproveFirst needs -From 3 or higher.' }
    Approve-Phase ($From - 1)
}

for ($n = $From; $n -le $To; $n++) {
    Invoke-Phase $n
}

Write-Host ''
Write-Host "Done: phases $From to $To merged." -ForegroundColor Green

// schema.org LegalService for the home page: verified facts only (docs/phases/05-security-privacy-seo.md,
// task 3): name, address, telephone and URL. Sources are those of src/config/site.ts.
import { contact, site } from "./site";

export function legalServiceData(siteUrl: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    // G-01
    name: site.name,
    url: siteUrl.href,
    // H-93, Q-05
    telephone: contact.phone.href.replace("tel:", ""),
    // H-94, H-95, PDF-05
    address: {
      "@type": "PostalAddress",
      // "Lago Sul · Brasília/DF": the neighbourhood belongs to the street line.
      streetAddress: `${contact.address.street}, ${contact.address.district.split(" · ")[0]}`,
      addressLocality: "Brasília",
      addressRegion: "DF",
      postalCode: contact.address.postcode.replace("CEP ", "").replace(".", ""),
      addressCountry: "BR",
    },
  };
}

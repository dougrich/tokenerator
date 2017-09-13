import { Resources } from "../universal";

const year = new Date().getFullYear();

export function getResources(lang: string): Resources {
  return {
    blankDescription: "With an untold backstory...",
    blankName: "Unnamed Hero",
    titleBrowse: "Browse",
    titleBuild: "Build",
    titleContact: "Contact",
    titleLegal: "Legal",
    copyrightNotice: `© ${year} Douglas Richardson`,
    tokenerator: "Tokenerator",
    titleLegalPages: "Legal Pages",
    titleTerms: "Terms of Use",
    titlePrivacy: "Privacy Policy",
    titleAcknowledgements: "Acknowledgements",
  };
}

import { Resources } from "../universal";

const year = new Date().getFullYear();

export function getResources(lang: string): Resources {
  return {
    back: "Back",
    blankDescription: "With an untold backstory...",
    blankName: "Unnamed Hero",
    copyrightNotice: `© ${year} Douglas Richardson`,
    titleAcknowledgements: "Acknowledgements",
    titleBrowse: "Browse",
    titleBuild: "Build",
    titleContact: "Contact",
    titleLegal: "Legal",
    titleLegalPages: "Legal Pages",
    titlePrivacy: "Privacy Policy",
    titleTerms: "Terms of Use",
    tokenerator: "Tokenerator",
  };
}

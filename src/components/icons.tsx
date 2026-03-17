import codeIcon from "../assets/code.svg";
import boldIcon from "../assets/bold.svg";
import italicIcon from "../assets/italic.svg";
import underlineIcon from "../assets/underline.svg";
import strikethroughIcon from "../assets/strikethrough.svg";
import h1Icon from "../assets/h1.svg";
import h2Icon from "../assets/h2.svg";
import h3Icon from "../assets/h3.svg";
import actionIcon from "../assets/action.svg";
import shotIcon from "../assets/shot.svg";
import roleIcon from "../assets/role.svg";
import backgroundIcon from "../assets/background.svg";
import dialogIcon from "../assets/dialog.svg";
import newlineIcon from "../assets/new-line.svg";

export function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

export function DeleteIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export function NavIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

export function BoldIcon() {
  return <img src={boldIcon} alt="Bold Icon" className="h-5 w-5" />;
}

export function ItalicIcon() {
  return <img src={italicIcon} alt="Italic Icon" className="h-5 w-5" />;
}

export function UnderlineIcon() {
  return <img src={underlineIcon} alt="Underline Icon" className="h-5 w-5" />;
}

export function StrikethroughIcon() {
  return <img src={strikethroughIcon} alt="Strikethrough Icon" className="h-5 w-5" />;
}

export function CodeIcon() {
  return <img src={codeIcon} alt="Code Icon" className="h-5 w-5" />;
}

export function H1Icon() {
  return <img src={h1Icon} alt="H1 Icon" className="h-5 w-5" />;
}

export function H2Icon() {
  return <img src={h2Icon} alt="H2 Icon" className="h-5 w-5" />;
}

export function H3Icon() {
  return <img src={h3Icon} alt="H3 Icon" className="h-5 w-5" />;
}

export function ActionIcon() {
  return <img src={actionIcon} alt="Action Icon" className="h-5 w-5" />;
}

export function ShotIcon() {
  return <img src={shotIcon} alt="Shot Icon" className="h-5 w-5" />;
}

export function RoleIcon() {
  return <img src={roleIcon} alt="Role Icon" className="h-5 w-5" />;
}

export function BackgroundIcon() {
  return <img src={backgroundIcon} alt="Background Icon" className="h-5 w-5" />;
}

export function DialogIcon() {
  return <img src={dialogIcon} alt="Dialog Icon" className="h-5 w-5" />;
}

export function NewLineIcon() {
  return <img src={newlineIcon} alt="New Line Icon" className="h-5 w-5" />;
}

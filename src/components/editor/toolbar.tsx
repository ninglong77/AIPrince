import {
  ActionIcon,
  BackgroundIcon,
  BoldIcon,
  CodeIcon,
  DialogIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  NewLineIcon,
  RoleIcon,
  ShotIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "../icons";
import { CustomHelper } from "./helper";
import { EditorType } from "./types";

export default function Toolbar({ editor }: { editor: EditorType }) {
    const tools: {
        comp: React.ReactNode;
        name: string;
        trigger: string;
        placeholder?: string;
      }[] = [
        {
          comp: <H1Icon />,
          name: "H1",
          trigger: "1",
          placeholder: "Heading 1, ctrl+1",
        },
        {
          comp: <H2Icon />,
          name: "H2",
          trigger: "2",
          placeholder: "Heading 2, ctrl+2",
        },
        {
          comp: <H3Icon />,
          name: "H3",
          trigger: "3",
          placeholder: "Heading 3, ctrl+3",
        },
        {
          comp: <CodeIcon />,
          name: "Code",
          trigger: "`",
          placeholder: "Code Block, ctrl+`",
        },
        {
          comp: <BoldIcon />,
          name: "Bold",
          trigger: "b",
          placeholder: "Bold, ctrl+b",
        },
        {
          comp: <ItalicIcon />,
          name: "Italic",
          trigger: "i",
          placeholder: "Italic, ctrl+i",
        },
        {
          comp: <UnderlineIcon />,
          name: "Underline",
          trigger: "u",
          placeholder: "Underline, ctrl+u",
        },
        {
          comp: <StrikethroughIcon />,
          name: "Strikethrough",
          trigger: "l",
          placeholder: "Strikethrough, ctrl+l",
        },
        {
          comp: <ShotIcon />,
          name: "Shot",
          trigger: "shot",
          placeholder:
            "Shot: a scene of the script, describing the background, role and dialog in the scene\n\nshift+enter for new line to exit shot",
        },
        {
          comp: <RoleIcon />,
          name: "Role",
          trigger: "role",
          placeholder: "Role",
        },
        {
          comp: <ActionIcon />,
          name: "Action",
          trigger: "action",
          placeholder: "Action of the role",
        },
        {
          comp: <BackgroundIcon />,
          name: "Background",
          trigger: "background",
          placeholder: "Background of the shot",
        },
        {
          comp: <DialogIcon />,
          name: "Dialog",
          trigger: "dialog",
          placeholder: "Dialog",
        },
        {
          comp: <NewLineIcon />,
          name: "New Line",
          trigger: "newline",
          placeholder: "New Line, Shift+Enter for new line in shot",
        },
      ];
    return <div className="flex gap-1">
            {tools.map(({ comp, name, trigger, placeholder }) => (
              <span key={name}>
                <button
                  onMouseDown={(event) => {
                    event.preventDefault();
                    CustomHelper.toggleByTrigger(editor, trigger);
                  }}
                  className="px-1 py-1 rounded hover:shadow"
                  title={placeholder}
                >
                  {comp}
                </button>
              </span>
            ))}
          </div>
}

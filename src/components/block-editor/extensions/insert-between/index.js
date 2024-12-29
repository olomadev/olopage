import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { TextSelection } from "prosemirror-state";

export const InsertBetween = Extension.create({
  name: "insertBetween",
  addOptions() {
    return {};
  },
  addProseMirrorPlugins() {
    let toolsShowing = false;
    let toolPosition = 0;

    const editor = this.editor;
    const { view } = editor;

    const tools = document.createElement("button");
    tools.classList.add("editor-node-tools");
    tools.ariaLabel = "Insert block here";
    tools.style.display = "none";

    editor.view.dom.addEventListener("click", () => {
      tools.style.display = "none";
    });

    tools.addEventListener("click", (event) => {
      editor.view.focus();
      event.preventDefault();
      const endPosition = getTopLevelNodePositionFromCoords(
        view,
        event.clientX,
        event.clientY - 25,
        true
      );
      const emptyParagraph = editor.schema.nodes["paragraph"];
      let tr = editor.state.tr.insert(endPosition, emptyParagraph.create());
      if (
        endPosition &&
        tr.doc?.content?.content &&
        Array.isArray(tr.doc.content.content) &&
        tr.doc.content.content[endPosition]
      ) {
        tr.setSelection(TextSelection.create(tr.doc, endPosition));
        editor.view.dispatch(tr);
      }
      tools.style.display = "none";
    });

    editor.view.dom.parentElement?.appendChild(tools);
    const getTopLevelNodeDOMFromCoords = (view, event) => {
      let position = getTopLevelNodePositionFromCoords(
        view,
        event.clientX,
        event.clientY - 25
      );
      return view.nodeDOM(position);
    };

    const getTopLevelNodePositionFromCoords = (view, x, y, after = false) => {
      let posAtCoords = view.posAtCoords({
        left: x,
        top: y,
      });

      if (!posAtCoords) return null;

      let resolvedPos = view.state.doc.resolve(posAtCoords.pos);

      return after ? resolvedPos.after(1) : resolvedPos.before(1);
    };

    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handleDOMEvents: {
            mousemove: (view, event) => {
              let nodeDOM = getTopLevelNodeDOMFromCoords(view, event);

              if (nodeDOM) {
                let rect = nodeDOM.getBoundingClientRect();

                let newToolPosition =
                  rect.bottom -
                  view.dom.getBoundingClientRect().top +
                  view.dom.offsetTop;

                if (
                  event.clientY > rect.bottom - 50 &&
                  (newToolPosition !== toolPosition || !toolsShowing)
                ) {
                  toolsShowing = true;
                  toolPosition = newToolPosition;
                  tools.style.top = `${newToolPosition}px`;
                  tools.style.right = `${rect.right - rect.width}px`;
                  tools.style.left = `${rect.left}px`;
                  tools.style.display = "";
                } else if (event.clientY <= rect.bottom - 50 && toolsShowing) {
                  tools.style.display = "none";
                  toolsShowing = false;
                  newToolPosition = 0;
                }
              }
            },
          },
        },
      }),
    ];
  },
});

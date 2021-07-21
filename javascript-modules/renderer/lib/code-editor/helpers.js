import {Transaction} from "@codemirror/state"
import {indentMore, indentLess} from "@codemirror/commands"
const tabButNot = "  "

/// Insert a tab character at the cursor or, if something is selected,
/// use [`indentMore`](#commands.indentMore) to indent the entire
/// selection.
const insertTab = ({state, dispatch}) => {
    if (state.selection.ranges.some(r => !r.empty)) return indentMore({state, dispatch})
    dispatch(state.update(state.replaceSelection(tabButNot), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}))
    return true
}

export const tabBinding = {
    key: "Tab", 
    run: insertTab, 
    shift: indentLess
}
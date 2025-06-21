import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { OverflowNode } from "@lexical/overflow"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

import { AutocompleteNode } from "@/components/ui/editor/nodes/autocomplete-node"
import { CollapsibleContainerNode } from "@/components/ui/editor/nodes/collapsible-container-node"
import { CollapsibleContentNode } from "@/components/ui/editor/nodes/collapsible-content-node"
import { CollapsibleTitleNode } from "@/components/ui/editor/nodes/collapsible-title-node"
import { FigmaNode } from "@/components/ui/editor/nodes/embeds/figma-node"
import { TweetNode } from "@/components/ui/editor/nodes/embeds/tweet-node"
import { YouTubeNode } from "@/components/ui/editor/nodes/embeds/youtube-node"
import { EmojiNode } from "@/components/ui/editor/nodes/emoji-node"
import { EquationNode } from "@/components/ui/editor/nodes/equation-node"
import { ExcalidrawNode } from "@/components/ui/editor/nodes/excalidraw-node"
import { ImageNode } from "@/components/ui/editor/nodes/image-node"
import { InlineImageNode } from "@/components/ui/editor/nodes/inline-image-node"
import { KeywordNode } from "@/components/ui/editor/nodes/keyword-node"
import { LayoutContainerNode } from "@/components/ui/editor/nodes/layout-container-node"
import { LayoutItemNode } from "@/components/ui/editor/nodes/layout-item-node"
import { MentionNode } from "@/components/ui/editor/nodes/mention-node"
import { PageBreakNode } from "@/components/ui/editor/nodes/page-break-node"
import { PollNode } from "@/components/ui/editor/nodes/poll-node"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    PageBreakNode,
    ImageNode,
    InlineImageNode,
    EmojiNode,
    KeywordNode,
    ExcalidrawNode,
    PollNode,
    LayoutContainerNode,
    LayoutItemNode,
    EquationNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
    AutoLinkNode,
    FigmaNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]

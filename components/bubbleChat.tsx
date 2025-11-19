import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { useContext } from "react";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";

export function BubbleChat({
  text,
  isUser,
}: {
  text: string;
  isUser: boolean;
}) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View
      style={{
        backgroundColor: isUser ? theme.orange : theme.tabsBack,
        padding: 10,
        borderRadius: 14,
        maxWidth: "75%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        marginBottom: isUser ? 4 : 10,
        marginTop: isUser ? 0 : 10,
        flexShrink: 1,
      }}
    >
      {isUser ? (
        <AppText style={{ color: theme.text, fontSize: 18, textAlign: "auto" }}>
          {text.trim()}
        </AppText>
      ) : (
        <Markdown
          style={{
            root: {
              margin: 0,
              padding: 0,
            },
            body: {
              color: theme.text,
              fontSize: 18,
              margin: 0,
              padding: 0,
            },

            paragraph: {
              marginTop: 2,
              marginBottom: 2,
            },

            bullet_list: {
              marginTop: 4,
              marginBottom: 4,
              paddingLeft: 10,
            },
            ordered_list: {
              marginTop: 4,
              marginBottom: 4,
              paddingLeft: 10,
            },
            list_item: {
              marginTop: 2,
              marginBottom: 2,
            },

            heading1: {
              color: theme.text,
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 6,
              marginBottom: 6,
            },
            heading2: {
              color: theme.text,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 6,
              marginBottom: 6,
            },

            link: { color: theme.orange },

            code_inline: {
              backgroundColor: theme.background,
              padding: 4,
              borderRadius: 6,
              color: theme.text,
            },

            code_block: {
              backgroundColor: theme.background,
              padding: 10,
              borderRadius: 8,
              color: theme.text,
              marginTop: 6,
              marginBottom: 6,
            },
          }}
        >
          {text.trim()}
        </Markdown>
      )}
    </View>
  );
}

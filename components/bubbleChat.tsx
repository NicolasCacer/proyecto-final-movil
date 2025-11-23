import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { useContext } from "react";
import { View } from "react-native";

type BubbleChatProps = {
  text?: string; // opcional
  isUser: boolean;
  children?: React.ReactNode; // opcional
};

export function BubbleChat({ text = "", isUser, children }: BubbleChatProps) {
  const themeContext = useContext(ThemeContext);
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
      {/* Mostrar texto solo si existe */}
      {text.trim().length > 0 && (
        <AppText style={{ color: theme.text, fontSize: 18, textAlign: "auto" }}>
          {text.trim()}
        </AppText>
      )}

      {/* Mostrar children solo si existe */}
      {children && <View>{children}</View>}
    </View>
  );
}

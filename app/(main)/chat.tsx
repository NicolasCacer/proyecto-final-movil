import { BubbleChat } from "@/components/bubbleChat";
import { ThemeContext } from "@/context/ThemeProvider";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function Chat() {
  const themeContext = useContext(ThemeContext);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [inputText, setInputText] = useState("");

  const [messages, setMessages] = useState([
    { text: "Hola, este es un mensaje de ejemplo", isUser: true },
    { text: "Hola, soy tu asistente virtual 🤖", isUser: false },
    { text: "¿Puedes ayudarme con una tarea?", isUser: true },
    { text: "Claro que sí. ¿Qué necesitas saber?", isUser: false },
    { text: "Estoy integrando un chat en mi aplicación.", isUser: true },
    {
      text: "Perfecto, puedo ayudarte con estilos, lógica y estructura 😄",
      isUser: false,
    },
    {
      text: "Genial, ¿cómo puedo hacer que el teclado no tape los inputs?",
      isUser: true,
    },
    {
      text: "Puedes envolver tu contenido en KeyboardAvoidingView...",
      isUser: false,
    },
    { text: "¡Listo, ya me funciona! Gracias 🙌", isUser: true },
    {
      text: "Me alegra ayudarte. Si quieres puedo mostrarte cómo animar burbujas 💬✨",
      isUser: false,
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { text: inputText.trim(), isUser: true }]);
    setInputText("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  // Scroll al entrar a la screen
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, []);

  // Detectar teclado y scrollear
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 8,
          }}
        >
          {messages.map((msg, i) => (
            <BubbleChat key={i} text={msg.text} isUser={msg.isUser} />
          ))}
        </ScrollView>

        {/* Barra inferior */}
        <View
          style={{
            height: 70,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: keyboardVisible ? 0 : 1,
            marginBottom: keyboardVisible ? 0 : insets.bottom + 20,
          }}
        >
          <TextInput
            placeholder="Pregúntame algo..."
            placeholderTextColor="#777"
            value={inputText}
            onChangeText={setInputText}
            style={{
              flex: 1,
              backgroundColor: theme.tabsBack,
              fontSize: 18,
              paddingHorizontal: 15,
              paddingVertical: 10,
              fontFamily: "Onest",
              color: theme.text,
              borderRadius: 100,
            }}
          />
          {inputText.trim().length > 0 && (
            <TouchableOpacity
              onPress={handleSend}
              style={{
                backgroundColor: theme.orange,
                padding: 10,
                borderRadius: 50,
                marginLeft: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Svg width={28} height={28} viewBox="0 0 24 24">
                  <Path
                    fill="none"
                    stroke={theme.text}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m14 10l-3 3m9.288-9.969a.535.535 0 0 1 .68.681l-5.924 16.93a.535.535 0 0 1-.994.04l-3.219-7.242a.54.54 0 0 0-.271-.271l-7.242-3.22a.535.535 0 0 1 .04-.993z"
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

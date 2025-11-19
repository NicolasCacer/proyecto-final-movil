import { BubbleChat } from "@/components/bubbleChat";
import { DataContext } from "@/context/DataContext";
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
  const { messagesAPI } = useContext(DataContext);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );

  // -------------------------------------------
  // DUMMY de IA (luego solo reemplazas esta función)
  // -------------------------------------------
  async function sendToAI(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `En menos de 20 palabras responde ${prompt}` }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No entiendo 🥲";

      return aiText;
    } catch (err) {
      console.error("ERROR GEMINI:", err);
      return "Se produjo un error al hablar con la IA 😵";
    }
  }

  // -------------------------------------------
  // Cargar mensajes desde Supabase
  // -------------------------------------------
  useEffect(() => {
    const loadMessages = async () => {
      const data = await messagesAPI.getAll();
      if (!data) return;

      // Convertir el formato de supabase → formato del chat
      const formatted = data
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .map((m: any) => ({
          text: m.message,
          isUser: m.is_user,
        }));

      setMessages(formatted);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------
  // Enviar mensaje
  // -------------------------------------------
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    // 1. Agregar al chat
    const userMessage = { text: userText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Guardar en Supabase
    await messagesAPI.create({
      message: userText,
      is_user: true,
    });

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);

    // 3. Obtiene respuesta del dummy IA
    const aiResponse = await sendToAI(userText);

    // 4. Agregar al chat
    const botMessage = { text: aiResponse, isUser: false };
    setMessages((prev) => [...prev, botMessage]);

    // 5. Guardar respuesta en supabase
    await messagesAPI.create({
      message: aiResponse,
      is_user: false,
    });

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  // -------------------------------------------
  // Mover scroll al abrir el teclado
  // -------------------------------------------
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
          style={{ flex: 1, width: "100%", paddingHorizontal: 8 }}
        >
          {messages.map((msg, i) => (
            <BubbleChat key={i} text={msg.text} isUser={msg.isUser} />
          ))}
        </ScrollView>

        {/* BARRA INFERIOR */}
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

import { ThemeContext } from "@/context/ThemeProvider";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Home() {
  const themeContext = useContext(ThemeContext);
  const [user, setUser] = useState("Pepito");
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/*Sección de perfil*/}
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: "bold", color: theme.text }}>
            Hola, {user}!
          </Text>
          <Text style={{ fontSize: 20, color: theme.text }}>
            Listo para entrenar?
          </Text>
        </View>
        <Image
          source={{
            uri: "https://s1.elespanol.com/2022/06/03/actualidad/677442473_224809016_1706x1511.jpg",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        ></Image>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <LinearGradient
          colors={[theme.orange, theme.red]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 20,
            padding: 2,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: theme.background,
              borderRadius: 18,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19c1.2-3.678 2.526-5.005 6-6c-3.474-.995-4.8-2.322-6-6c-1.2 3.678-2.526 5.005-6 6c3.474.995 4.8 2.322 6 6Z
           M7 10c.6-1.84 1.263-2.503 3-3c-1.737-.497-2.4-1.16-3-3c-.6 1.84-1.263 2.503-3 3c1.737.497 2.4 1.16 3 3Z
           M8.5 21c.3-.92.631-1.251 1.5-1.5c-.869-.249-1.2-.58-1.5-1.5c-.3.92-.631 1.251-1.5 1.5c.869.249 1.2.58 1.5 1.5Z"
                stroke="#fff"
                strokeWidth={2}
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
            <Text style={{ fontSize: 18, color: theme.text }}>
              Recomendación IA
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View
        style={{
          flexDirection: "column",
          marginTop: 20,
          backgroundColor: theme.tabsBack,
          width: "100%",
          height: 150,
          borderRadius: 20,
        }}
      ></View>
      <Text
        style={{
          fontSize: 20,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 20,
          marginLeft: 10,
          fontWeight: "bold",
        }}
      >
        Actividad semanal
      </Text>

      <View
        style={{
          flexDirection: "column",
          marginTop: 20,
          backgroundColor: theme.tabsBack,
          width: "100%",
          height: 150,
          borderRadius: 20,
        }}
      ></View>
      <Text
        style={{
          fontSize: 20,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 20,
          marginLeft: 10,
          fontWeight: "bold",
        }}
      >
        Avances
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 20,
          width: "100%",
          height: 150,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            marginTop: 20,
            backgroundColor: theme.tabsBack,
            width: "50%",
            height: 150,
            borderRadius: 20,
          }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            marginTop: 20,
            backgroundColor: theme.tabsBack,
            width: "50%",
            height: 150,
            borderRadius: 20,
          }}
        ></View>
      </View>
      <Text
        style={{
          fontSize: 20,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 20,
          marginLeft: 10,
          fontWeight: "bold",
        }}
      >
        Alimentación
      </Text>

      <View
        style={{
          flexDirection: "column",
          marginTop: 20,
          backgroundColor: theme.tabsBack,
          width: "100%",
          height: 150,
          borderRadius: 20,
        }}
      ></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 80,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 150,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

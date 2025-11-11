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
import Svg, { G, Path } from "react-native-svg";

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
            uri: "https://i.pinimg.com/236x/ca/4d/1c/ca4d1ca44a867adb45e8b220e3ebb5e9.jpg",
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
          flexDirection: "row",
          marginTop: 20,
          backgroundColor: theme.tabsBack,
          opacity: 1,
          width: "100%",
          height: "auto",
          borderRadius: 20,
          shadowColor: theme.text,
          shadowRadius: 2,
          padding: 12,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingRight: 5,
            paddingLeft: 5,
            paddingVertical: 5,
            gap: 15,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: theme.text,
              fontWeight: "bold",
              maxWidth: 170,
            }}
          >
            Rutina Cuerpo Completo
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <G fill="none">
                <Path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <Path
                  fill={theme.text}
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                />
              </G>
            </Svg>
            <Text
              style={{
                fontSize: 16,
                color: theme.text,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {45} min
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: theme.text,
                borderColor: "#1acf13ff",
                borderWidth: 2,
                borderRadius: 50,
                paddingHorizontal: 6,
                paddingVertical: 1,
              }}
            >
              medio
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: theme.orange,
              borderRadius: 100,
              paddingVertical: 3,
              width: "85%",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: theme.text,
                fontWeight: "bold",
              }}
            >
              Comenzar
            </Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: "https://st.depositphotos.com/1110663/1258/i/450/depositphotos_12582372-stock-photo-gym-room.jpg",
          }}
          style={{
            flex: 1,
            resizeMode: "cover",
            borderRadius: 10,
          }}
        ></Image>
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
            opacity: 0.5,
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

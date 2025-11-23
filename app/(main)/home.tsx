import FoodCard from "@/components/foodCard";
import GaugeProgress from "@/components/gaugeProgress";
import RecommendationDailyHome from "@/components/recommendationDailyHome";
import TrendChart from "@/components/trendChart";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Home() {
  const themeContext = useContext(ThemeContext);
  const authContex = useContext(AuthContext);
  const [user] = useState(authContex.user?.name || "Usuario");
  const week_kcal = { L: 100, M: 100, Mi: 200, J: 450, V: 10, S: 260, D: 50 };
  const targetKcal = 2000;

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
          <AppText
            style={{ fontSize: 36, fontWeight: "bold", color: theme.text }}
          >
            Hola, {user}!
          </AppText>
          <AppText style={{ fontSize: 20, color: theme.text }}>
            Vamos a entrenar?
          </AppText>
        </View>
        <Image
          source={{
            uri:
              authContex.user?.avatar_url ||
              "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740&q=80",
          }}
          style={{
            width: 90,
            height: 90,
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
            <AppText style={{ fontSize: 18, color: theme.text }}>
              hoy te recomendamos
            </AppText>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <RecommendationDailyHome
        data={{
          title: "Rutina Cuerpo Completo",
          duration: 45,
          intensity: "media",
          image:
            "https://st.depositphotos.com/1110663/1258/i/450/depositphotos_12582372-stock-photo-gym-room.jpg",
        }}
      />
      <AppText
        style={{
          fontSize: 24,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 20,
          marginLeft: 10,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Actividad semanal
      </AppText>

      <TrendChart data={week_kcal} />
      <AppText
        style={{
          fontSize: 24,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 20,
          marginLeft: 10,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Avances
      </AppText>
      <GaugeProgress data={week_kcal} meta={targetKcal}></GaugeProgress>
      <AppText
        style={{
          fontSize: 24,
          width: "100%",
          color: theme.text,
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 20,
          marginLeft: 10,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Alimentación
      </AppText>

      <FoodCard
        title="Ensalada Mediterránea"
        image="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=150&q=80"
        description="Una combinación fresca de vegetales, aceite de oliva y hierbas aromáticas."
        ingredients={[
          "Lechuga",
          "Tomate",
          "Pepino",
          "Aceitunas",
          "Aceite de oliva",
          "Hierbas aromáticas",
        ]}
        preparation="Lava y corta los vegetales, mezcla con aceitunas y adereza con aceite de oliva y hierbas."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
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

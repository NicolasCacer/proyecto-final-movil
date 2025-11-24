import ai from "@/assets/lotties/ai.json";
import FoodCard from "@/components/foodCard";
import GaugeProgress from "@/components/gaugeProgress";
import RecommendationDailyHome from "@/components/recommendationDailyHome";
import TrendChart from "@/components/trendChart";
import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  actualweight: number;
  targetweight: number;
  height: number;
  activitylevel: string;
  fatindex?: number | null;
  targetfatindex?: number | null;
  avatar_url?: string | null;
  aicontext?: string | null;
  targetKcal?: number;
}

export default function Home() {
  const themeContext = useContext(ThemeContext);
  const authContex = useContext(AuthContext);
  const { activitiesAPI, exercisesAPI } = useContext(DataContext);
  const [aiMuttonMsg, setMessage] = useState<string>("Recomendación IA");

  const { user } = authContex;
  const [loadingAI, setLoadingAI] = useState(false);
  const [dailyExercise, setDailyExercise] = useState<any>(null);
  const [dailyFood, setDailyFood] = useState<any>(null);

  const { theme } = themeContext;
  const targetKcal = user?.targetKcal ?? 7000;

  // -------------------------------
  // 🔥 kcal semanal
  // -------------------------------
  const [weekKcal, setWeekKcal] = useState<any>(null);

  // =====================================================================
  // 🧠 IA — Recomendación de comida — SOLO UNA VEZ
  // =====================================================================
  async function handleDailyFoodRecommendation() {
    const prompt = `
      Eres un chef saludable experto en nutrición deportiva.
      Genera una receta breve y saludable en formato JSON con exactamente:
      Debe ser una receta ideal para alguien con estas características:
      - Peso actual: ${user?.actualweight} kg
      - Peso objetivo: ${user?.targetweight} kg
      - Altura: ${user?.height} cm
      - Nivel de actividad: ${user?.activitylevel}
      La receta debe ser simple, rápida y saludable.
      No incluyas unidades de medida si no son necesarias. usa nombre cortos.
      IMPORTANTE:
      La imagen debe ser SIEMPRE una URL real, existente, de bancos de imágenes confiables como:
      - unsplash.com
      - images.unsplash.com
      - pexels.com
      - pixabay.com

      NO inventes URLs.
      NO uses dominios desconocidos.

    `;

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
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Nombre muy corto" },
                  image: { type: "string" },
                  description: {
                    type: "string",
                    description: "Breve, en menos de 15 palabras",
                  },
                  ingredients: { type: "array", items: { type: "string" } },
                  preparation: { type: "string" },
                },
                required: [
                  "title",
                  "image",
                  "description",
                  "ingredients",
                  "preparation",
                ],
              },
            },
          }),
        }
      );

      const data = await response.json();
      const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) return;

      const food = JSON.parse(jsonText);
      setDailyFood(food);
    } catch (err) {
      console.log("Error generando comida IA", err);
    }
  }

  // =====================================================================
  // 🧠 IA — Recomendación de ejercicio — SOLO UNA VEZ
  // =====================================================================
  const handleDailyExerciseRecommendation = async () => {
    const prompt = `
      Semilla ${Math.random()}.
      Eres un coach profesional. Genera una recomendación de ejercicio corta para mostrar en la pantalla de inicio.

      El usuario tiene:
      - Peso actual: ${user?.actualweight} kg
      - Peso objetivo: ${user?.targetweight} kg
      - Altura: ${user?.height} cm
      - Nivel de actividad: ${user?.activitylevel}

      Devuelve un JSON EN ESTRICTO FORMATO, y con respuestas cortas.
      IMPORTANTE:
      La imagen debe ser SIEMPRE una URL real, existente, de bancos de imágenes confiables como:
      - unsplash.com
      - images.unsplash.com
      - pexels.com
      - pixabay.com

      NO inventes URLs.
      NO uses dominios desconocidos.

    `;

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
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Nombre muy corto" },
                  duration: { type: "number" },
                  intensity: {
                    type: "string",
                    enum: ["baja", "media", "alta"],
                  },
                  image: { type: "string", description: "url" },
                },
                required: ["title", "duration", "intensity", "image"],
              },
            },
          }),
        }
      );

      const data = await response.json();
      const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonText) return;

      const parsed = JSON.parse(jsonText);
      setDailyExercise(parsed);
    } catch (err) {
      console.log("Error recomendación diaria IA:", err);
    }
  };

  // =====================================================================
  // 🚀 useEffect — IA SOLO UNA VEZ
  // =====================================================================
  const handleAICall = async () => {
    setLoadingAI(true);
    setMessage("hoy te recomendamos...");

    try {
      await Promise.all([
        handleDailyExerciseRecommendation(),
        handleDailyFoodRecommendation(),
      ]);
    } catch (error) {
      console.log("Error IA:", error);
    } finally {
      setMessage("Nueva recomendación IA");
      setLoadingAI(false);
    }
  };

  // =====================================================================
  // 🔄 useFocusEffect — datos que deben refrescarse cada vez
  // =====================================================================
  useFocusEffect(
    useCallback(() => {
      async function loadWeekly() {
        const activities = await activitiesAPI.getAll();
        const exercises = await exercisesAPI.getAll();

        if (!activities || !exercises) return;

        const weekly = { L: 0, M: 0, Mi: 0, J: 0, V: 0, S: 0, D: 0 };

        activities.forEach((act: any) => {
          const exercise = exercises.find((e: any) => e.id === act.exercise_id);
          if (!exercise) return;

          const kcal = exercise.kcal ?? 0;
          const day = new Date(act.created_at).getDay();

          switch (day) {
            case 1:
              weekly.L += kcal;
              break;
            case 2:
              weekly.M += kcal;
              break;
            case 3:
              weekly.Mi += kcal;
              break;
            case 4:
              weekly.J += kcal;
              break;
            case 5:
              weekly.V += kcal;
              break;
            case 6:
              weekly.S += kcal;
              break;
            case 0:
              weekly.D += kcal;
              break;
          }
        });

        setWeekKcal(weekly);
      }

      loadWeekly();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // =====================================================================
  // UI (no se tocó NADA)
  // =====================================================================
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* PERFIL */}
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
            Hola, {user?.name}!
          </AppText>
          <AppText style={{ fontSize: 20, color: theme.text }}>
            Vamos a entrenar?
          </AppText>
        </View>

        <Image
          source={{
            uri:
              user?.avatar_url ||
              "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg",
          }}
          style={{ width: 90, height: 90, borderRadius: 50 }}
        />
      </View>

      {/* RECOMENDACIÓN IA */}
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
          style={{ borderRadius: 20, padding: 2 }}
        >
          <TouchableOpacity
            onPress={handleAICall}
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
              {aiMuttonMsg}
            </AppText>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {loadingAI && (
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <LottieView
            source={ai}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}

      {dailyExercise ? <RecommendationDailyHome data={dailyExercise} /> : <></>}

      {dailyFood ? (
        <>
          <AppText
            style={{
              fontSize: 24,
              width: "100%",
              color: theme.text,
              marginTop: 20,
              marginLeft: 10,
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            Alimentación
          </AppText>
          <FoodCard
            title={dailyFood.title}
            image={dailyFood.image}
            description={dailyFood.description}
            ingredients={dailyFood.ingredients}
            preparation={dailyFood.preparation}
          />
        </>
      ) : (
        <></>
      )}

      {/* CHARTS */}
      <AppText style={styles.section}>Actividad semanal</AppText>
      {weekKcal && <TrendChart data={weekKcal} />}

      <AppText style={styles.section}>Avances</AppText>
      {weekKcal && <GaugeProgress data={weekKcal} meta={targetKcal} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingTop: 60,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 150,
  },
  section: {
    fontSize: 24,
    width: "100%",
    color: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
    fontWeight: "bold",
  },
});

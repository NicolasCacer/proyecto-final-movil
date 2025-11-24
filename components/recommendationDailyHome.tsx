import ai from "@/assets/lotties/ai.json";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

interface recommendationDailyHomeProps {
  data: {
    title: string;
    duration: number;
    intensity: string;
    image: string;
  };
}

export default function RecommendationDailyHome({
  data,
}: recommendationDailyHomeProps) {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = themeContext;

  const handleAIRecommendation = async () => {
    const prompt = `
        Semilla ${Math.random()}. 
        Eres un coach fitness profesional. Genera una rutina de ejercicios en JSON sin unidades de medida. 
        El usuario tiene las siguientes características:
        - Peso actual: ${user?.actualweight} kg
        - Peso objetivo: ${user?.targetweight} kg
        - Altura: ${user?.height} cm
        - Nivel de actividad: ${user?.activitylevel}
        - Porcentaje de grasa corporal actual: ${
          user?.fatindex ?? "no proporcionado"
        }
        - Porcentaje de grasa objetivo: ${
          user?.targetfatindex ?? "no proporcionado"
        }
        Ten en cuenta también esta información adicional que el usuario proporcionó: ${
          user?.aicontext ?? "ninguna"
        }
        La suma del total de los ejercicios debería de ser aproximadamente ${
          data.duration
        } minutos, con una intensidad ${
      data.intensity
    }, muy relacionado todo con ${data.title}.`;

    try {
      setIsLoading(true);
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
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: `${data.title}`,
                  },
                  description: {
                    type: "string",
                    description:
                      "Descripción detallada de la rutina: objetivos, intensidad, músculos trabajados y recomendaciones generales",
                  },
                  ejercicios: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        nombre: {
                          type: "string",
                          description:
                            "nombre corto y explicativo del ejercicio",
                        },
                        series: { type: "string" },
                        minReps: { type: "string" },
                        maxReps: { type: "string" },
                        peso: {
                          type: "string",
                          description:
                            "peso de mancuernas, pesas, barra, etc. Si es peso corporal omitir este campo. debe ser numerico o sino nulo",
                        },
                        musculo: {
                          type: "string",
                          enum: [
                            "Pecho",
                            "Espalda",
                            "Piernas",
                            "Glúteos",
                            "Hombros",
                            "Brazos",
                            "Abdomen",
                            "Cardio",
                          ],
                        },
                        intensidad: {
                          type: "string",
                          enum: ["baja", "media", "alta"],
                          description: `${data.intensity}`,
                        },
                        descripcionEj: {
                          type: "string",
                          description:
                            "explicación breve del ejercicio o movimientos. Adevertencias en caso de ser necesario",
                        },
                        kcal: {
                          type: "string",
                          description:
                            "kcal estimadas a quemar por esta rutina",
                        },
                        minutes: {
                          type: "string",
                          description:
                            "minutos estimados de duración de este ejericio con todos sus sets y repeticiones",
                        },
                      },
                      required: [
                        "nombre",
                        "series",
                        "minReps",
                        "maxReps",
                        "musculo",
                        "intensidad",
                        "kcal",
                        "minutes",
                      ],
                    },
                  },
                },
                required: ["name", "description", "ejercicios"],
              },
            },
          }),
        }
      );

      const d = await response.json();
      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const hoy = diasSemana[new Date().getDay()];

      const jsonText = d?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) {
        Alert.alert("Error", "No se pudo generar la rutina con la IA");
        return;
      }

      const aiRutina = JSON.parse(jsonText);

      // Asignar el día actual
      aiRutina.day = hoy;

      // Agregar IDs a los ejercicios
      const ejerciciosConId = aiRutina.ejercicios.map(
        (ej: any, index: number) => ({
          ...ej,
          id: `ej${index + 1}`,
        })
      );

      const rutinaFinal = { ...aiRutina, ejercicios: ejerciciosConId };

      // Codificar y redirigir
      const encoded = encodeURIComponent(JSON.stringify(rutinaFinal));
      router.push(`/create-routine?prefill=${encoded}`);
    } catch (err) {
      console.log("Error generando rutina IA:", err);
      Alert.alert("Error", "Ocurrió un error al generar la rutina con la IA");
    } finally {
      setIsLoading(false);
    }
  };

  const getIntensityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "baja":
        return "#1acf13ff"; // verde
      case "media":
        return "#f7b500"; // amarillo
      case "alta":
        return "#ff3b30"; // rojo
      default:
        return theme.text;
    }
  };

  const defaultImg =
    "https://st.depositphotos.com/1110663/1258/i/450/depositphotos_12582372-stock-photo-gym-room.jpg";

  // 🔥 Nueva validación completa: estructura + HEAD real
  const validateImageUrl = async (url: string, fallback: string) => {
    try {
      new URL(url);
    } catch (e) {
      console.log("❌ URL inválida (estructura):", e);
      return fallback;
    }

    try {
      const response = await fetch(url, { method: "HEAD" });

      const isOk =
        response.ok && response.headers.get("content-type")?.includes("image");

      if (isOk) {
        console.log("✅ URL válida (HEAD):", url);
        return url;
      } else {
        console.log("❌ URL no es imagen o no sirve:", url);
        return fallback;
      }
    } catch (err) {
      console.log("❌ Error verificando URL:", err);
      return fallback;
    }
  };

  const [safeImageUrl, setSafeImageUrl] = useState(defaultImg);

  useEffect(() => {
    (async () => {
      const finalUrl = await validateImageUrl(data.image, defaultImg);
      setSafeImageUrl(finalUrl);
    })();
  }, [data.image]);

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 20,
        backgroundColor: theme.tabsBack,
        width: "100%",
        borderRadius: 20,
        shadowColor: theme.text,
        shadowRadius: 2,
        padding: 12,
      }}
    >
      {!isLoading && (
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
          {/* Título dinámico */}
          <AppText
            style={{
              fontSize: 24,
              color: theme.text,
              fontWeight: "bold",
              maxWidth: 170,
            }}
          >
            {data.title}
          </AppText>

          {/* Duración / Intensidad */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Ícono del reloj */}
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <G fill="none">
                <Path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <Path
                  fill={theme.text}
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                />
              </G>
            </Svg>

            {/* Duración dinámica */}
            <AppText
              style={{
                fontSize: 16,
                color: theme.text,
              }}
            >
              {data.duration} min
            </AppText>

            {/* Intensidad dinámica */}
            <AppText
              style={{
                fontSize: 16,
                color: theme.text,
                borderColor: getIntensityColor(data.intensity),
                borderWidth: 2,
                borderRadius: 50,
                paddingHorizontal: 6,
                paddingVertical: 1,
                textTransform: "capitalize",
              }}
            >
              {data.intensity}
            </AppText>
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.orange,
              borderRadius: 100,
              paddingVertical: 3,
              width: "85%",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={handleAIRecommendation}
          >
            <AppText
              style={{
                fontSize: 20,
                color: theme.text,
                fontWeight: "bold",
                fontFamily: "onest",
              }}
            >
              Comenzar
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Imagen dinámica */}
      {!isLoading && (
        <Image
          source={{ uri: safeImageUrl }}
          contentFit="cover"
          style={{
            flex: 1,
            borderRadius: 10,
          }}
        />
      )}

      {isLoading && (
        <View
          style={{
            width: "100%",
            height: 140,
            borderRadius: 10,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          <LottieView
            source={ai}
            autoPlay
            loop
            style={{
              width: "90%",
              height: "90%",
            }}
          />
        </View>
      )}
    </View>
  );
}

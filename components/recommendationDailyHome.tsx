import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
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

  const { theme } = themeContext;

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
          onPress={() => router.push("/(main)/training")}
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

      {/* Imagen dinámica */}
      <Image
        source={{
          uri: data.image,
        }}
        style={{
          flex: 1,
          resizeMode: "cover",
          borderRadius: 10,
        }}
      />
    </View>
  );
}

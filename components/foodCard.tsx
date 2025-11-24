import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { Image } from "expo-image";
import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import Svg, { Path } from "react-native-svg";

interface FoodCardProps {
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  preparation: string;
  icon?: React.ReactNode;
  buttonText?: string;
}

export default function FoodCard({
  title,
  image,
  description,
  ingredients,
  preparation,
  icon,
  buttonText = "Cerrar",
}: FoodCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [safeImage, setSafeImage] = useState(image);
  const themeContext = useContext(ThemeContext);

  const { theme } = themeContext;
  const defaultImg =
    "https://jumboalacarta.com.ar/wp-content/uploads/2019/06/shutterstock_521741356-1024x684.jpg";

  const isValidUrl = async (url?: string): Promise<boolean> => {
    if (!url) return false;

    // --- Validar estructura ---
    try {
      new URL(url);
    } catch (e) {
      console.log("❌ URL inválida (estructura):", e);
      return false;
    }

    // --- Validar HEAD ---
    try {
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        console.log("✅ URL válida y existe:", url);
        return true;
      }

      console.log("❌ URL válida pero NO existe:", url, response.status);
      return false;
    } catch (err) {
      console.log("❌ Error verificando URL:", url, err);
      return false;
    }
  };

  // ======================================================
  //  VALIDAR IMAGEN UNA VEZ Y GUARDAR RESULTADO
  // ======================================================
  useEffect(() => {
    const checkImage = async () => {
      const ok = await isValidUrl(image);
      setSafeImage(ok ? image : defaultImg);
    };
    checkImage();
  }, [image]);

  return (
    <View style={{ width: "100%" }}>
      {/* Tarjeta */}
      <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
        {/* Imagen */}
        <Image source={{ uri: safeImage }} style={styles.image} />

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <AppText style={[styles.title, { color: theme.text }]}>
              {title}
            </AppText>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[styles.button, { backgroundColor: theme.orange }]}
            >
              {icon || (
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"
                    stroke={theme.text}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </TouchableOpacity>
          </View>

          <AppText style={[styles.description, { color: theme.text }]}>
            {description}
          </AppText>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.tabsBack }]}
          >
            <AppText style={[styles.title, { color: theme.text }]}>
              {title}
            </AppText>

            <ScrollView style={{ marginVertical: 10 }}>
              <AppText style={{ color: theme.text, marginBottom: 5 }}>
                Ingredientes:
              </AppText>

              {ingredients.map((item, index) => (
                <AppText key={index} style={{ color: theme.text }}>
                  - {item}
                </AppText>
              ))}

              <AppText
                style={{ color: theme.text, marginTop: 10, marginBottom: 5 }}
              >
                Preparación:
              </AppText>

              <AppText style={{ color: theme.text }}>{preparation}</AppText>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.button,
                {
                  alignSelf: "center",
                  marginTop: 10,
                  width: 80,
                  backgroundColor: theme.orange,
                },
              ]}
            >
              <AppText
                style={{
                  color: theme.text,
                  fontWeight: "bold",
                }}
              >
                {buttonText}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    height: 160,
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
    gap: 12,
  },

  image: {
    width: 120,
    height: "100%",
    borderRadius: 15,
  },

  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flexShrink: 1,
    flexGrow: 1,
  },

  description: {
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
    maxHeight: 60,
  },
  button: {
    padding: 8,
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContent: {
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
    shadowColor: "#FF7E33",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 12,
  },
});

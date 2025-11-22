import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import React, { useContext, useState } from "react";
import {
  Image,
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
  const themeContext = useContext(ThemeContext);

  const { theme } = themeContext;

  return (
    <View style={{ width: "100%" }}>
      {/* Tarjeta */}
      <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
        {/* Imagen */}
        <Image source={{ uri: image }} style={styles.image} />

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
              {/* Ícono dinámico, si no se pasa, se usa uno por defecto */}
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

          <AppText
            style={[styles.description, { color: theme.text }]}
            numberOfLines={4}
          >
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
    height: 150,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: "100%",
    borderRadius: 15,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flexShrink: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 15,
    flex: 1,
    marginTop: 6,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexShrink: 0,
    minWidth: 32,
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

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

export default function FoodCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={{ width: "100%" }}>
      {/* Tarjeta */}
      <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
        {/* Imagen */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=150&q=80",
          }}
          style={styles.image}
        />

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <AppText style={[styles.title, { color: theme.text }]}>
              Ensalada Mediterránea
            </AppText>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[styles.button, { backgroundColor: theme.orange }]}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"
                  stroke={theme.text}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <AppText
            style={[styles.description, { color: theme.text }]}
            numberOfLines={4}
          >
            Una combinación fresca de vegetales, aceite de oliva y hierbas
            aromáticas para una comida saludable.
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
              Ensalada Mediterránea
            </AppText>
            <ScrollView style={{ marginVertical: 10 }}>
              <AppText style={{ color: theme.text, marginBottom: 5 }}>
                Ingredientes:
              </AppText>
              <AppText style={{ color: theme.text }}>
                - Lechuga{"\n"}- Tomate{"\n"}- Pepino{"\n"}- Aceitunas{"\n"}-
                Aceite de oliva{"\n"}- Hierbas aromáticas
              </AppText>
              <AppText
                style={{ color: theme.text, marginTop: 10, marginBottom: 5 }}
              >
                Preparación:
              </AppText>
              <AppText style={{ color: theme.text }}>
                Lava y corta los vegetales, mezcla con aceitunas y adereza con
                aceite de oliva y hierbas.
              </AppText>
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
                Cerrar
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
    maxWidth: 150,
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
    // Elevation para Android
    elevation: 12,
  },
});

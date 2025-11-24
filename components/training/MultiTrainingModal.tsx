import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface MultiEntrenarButtonProps {
  rutina: {
    id: string;
    name: string;
    description?: string;
  };
}

const MultiEntrenarButton: React.FC<MultiEntrenarButtonProps> = ({
  rutina,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleCreateRoom = () => {
    setModalVisible(false);
    // Enviamos la acción "create" como parámetro
    router.push(`/(modals)/live-training?action=create`);
  };

  const handleJoinRoom = () => {
    setModalVisible(false);
    // Enviamos la acción "join" como parámetro
    router.push(`/(modals)/live-training?action=join`);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.entrenarButton, { backgroundColor: theme.red }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="play-circle" size={24} color="#fff" />
        <AppText style={styles.entrenarButtonText}>Multi Entrenar</AppText>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.red }]}
              onPress={handleCreateRoom}
            >
              <AppText style={[styles.modalButtonText, { color: theme.white }]}>
                Crear Sala
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.red }]}
              onPress={handleJoinRoom}
            >
              <AppText style={[styles.modalButtonText, { color: theme.white }]}>
                Unirse a Sala
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.text }]}
              onPress={() => setModalVisible(false)}
            >
              <AppText
                style={[styles.modalButtonText, { color: theme.background }]}
              >
                Cancelar
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  entrenarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 10,
    elevation: 4,
    shadowColor: "#FF7E33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  entrenarButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default MultiEntrenarButton;

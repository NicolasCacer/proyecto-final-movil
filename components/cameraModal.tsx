import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (uri: string) => void;
};

export default function CameraModal({ visible, onClose, onSelect }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("front");
  const cameraRef = useRef<CameraView | null>(null);

  // Si todavía no se ha inicializado permission
  if (!permission) return null;

  // ===== Modal de permisos (estilo iOS) =====
  if (!permission.granted) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.permissionAlert}>
            <MaterialIcons
              name="photo-camera"
              size={44}
              color="#2E38F2"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.alertTitle}>Permitir acceso a la cámara</Text>
            <Text style={styles.alertMessage}>
              Esta aplicación requiere acceso a la cámara para tomar o
              seleccionar tu foto de perfil.
            </Text>

            <View style={styles.alertButtons}>
              {/* Botón estilo 'No permitir' (texto) */}
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSecondaryText}>No permitir</Text>
              </TouchableOpacity>

              {/* Botón Permitir (primario) */}
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={async () => {
                  try {
                    // requestPermission es provisto por useCameraPermissions
                    // la respuesta actualiza `permission` y disparará re-render
                    await requestPermission();
                  } catch (error) {
                    console.log(error);
                    // no hacemos nada complejo aquí; el hook actualizará permission
                  }
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Permitir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // ===== Cámara (cuando ya hay permiso) =====
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onSelect(photo.uri);
      onClose();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onSelect(result.assets[0].uri);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={type} />

        {/* Botón cerrar */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Controles inferiores estilo iPhone */}
        <View style={styles.bottomControls}>
          {/* Galería */}
          <TouchableOpacity onPress={pickImage} style={styles.sideBtn}>
            <MaterialIcons name="photo-library" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Capturar */}
          <TouchableOpacity onPress={takePhoto} style={styles.captureBtn} />

          {/* Voltear cámara */}
          <TouchableOpacity
            onPress={() => setType(type === "back" ? "front" : "back")}
            style={styles.sideBtn}
          >
            <MaterialCommunityIcons
              name="camera-flip-outline"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /** ===== Cámara ===== */
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  closeBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  closeText: { color: "#fff", fontSize: 20, fontWeight: "600" },

  bottomControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "#ddd",
  },

  sideBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  /** ===== Permisos estilo iOS (alert centered) ===== */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.36)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  permissionAlert: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 14,
    color: "#6b6b71",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },
  alertButtons: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: 10,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f7",
  },
  btnSecondaryText: {
    fontSize: 16,
    color: "#1c1c1e",
    fontWeight: "600",
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
  btnPrimaryText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
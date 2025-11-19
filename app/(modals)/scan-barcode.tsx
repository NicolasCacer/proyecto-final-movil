import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanBarcode() {
  const router = useRouter();
  const scanningRef = useRef(false);
  const themeContext = useContext(ThemeContext);
  const { productsAPI } = useContext(DataContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!themeContext) return null;
  const { theme } = themeContext;

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={[styles.permissionTitle, { color: theme.text }]}>
            Permiso de Cámara
          </Text>
          <Text style={[styles.permissionText, { color: "#999" }]}>
            Necesitamos acceso a tu cámara para escanear códigos de barras
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: theme.orange }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = ({ type, data }: any) => {
    if (scanningRef.current) return;

    scanningRef.current = true;
    setScanned(true);

    console.log(`Código escaneado: ${data}`);

    Alert.alert("Código Escaneado", `Código de barras: ${data}`, [
      {
        text: "Buscar Producto",
        onPress: () => searchProduct(data),
      },
      {
        text: "Escanear Otro",
        onPress: () => {
          setScanned(false);
          scanningRef.current = false;
        },
      },
      {
        text: "Cancelar",
        onPress: () => router.back(),
      },
    ]);
  };

  const searchProduct = async (barcode: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,brands,nutriments`
      );
      const data = await response.json();

      if (data.status === 1) {
        const product = data.product;

        Alert.alert(
          "Producto Encontrado",
          `${product.product_name || "Sin nombre"}\n\nCalorías: ${
            product.nutriments?.["energy-kcal_100g"] || "N/A"
          } kcal/100g`,
          [
            {
              text: "Agregar",
              onPress: async () => {
                const newFood = {
                  name: product.product_name || "N/A",
                  brand: product.brands || "N/A",
                  kcal: product.nutriments?.["energy-kcal_value"] ?? 0,
                  proteins: product.nutriments?.["proteins_value"] ?? 0,
                  carbohydrates:
                    product.nutriments?.["carbohydrates_value"] ?? 0,
                  fats: product.nutriments?.["fat_value"] ?? 0,
                };

                const success = await productsAPI.create(newFood);

                if (success) {
                  Alert.alert("Éxito", "Producto agregado correctamente");
                  console.log("Nuevo alimento agregado:", newFood);
                  router.back();
                } else {
                  Alert.alert("Error", "No se pudo guardar el alimento");
                }
              },
            },
            {
              text: "Escanear Otro",
              onPress: () => {
                setScanned(false);
                scanningRef.current = false;
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Producto No Encontrado",
          "No se encontró información para este código. ¿Deseas agregarlo manualmente?",
          [
            {
              text: "Agregar Manualmente",
              onPress: () => router.replace("/add-food"),
            },
            {
              text: "Escanear Otro",
              onPress: () => {
                setScanned(false);
                scanningRef.current = false;
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);
      Alert.alert("Error", "No se pudo buscar el producto.", [
        { text: "Reintentar", onPress: () => searchProduct(barcode) },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Código</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          zoom={0.25}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // ← aquí está la magia
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "qr",
            ],
          }}
        />

        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {!scanned && <View style={styles.scanLine} />}
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <View style={styles.instructionsContainer}>
              <Ionicons name="scan" size={32} color="#fff" />
              <Text style={styles.instructionsText}>
                {scanned ? "Código escaneado" : "Apunta al código de barras"}
              </Text>
              <Text style={styles.instructionsSubtext}>
                Centra el código en el marco
              </Text>
            </View>
          </View>
        </View>
      </View>

      {scanned && (
        <TouchableOpacity
          style={[styles.rescanButton, { backgroundColor: theme.orange }]}
          onPress={() => {
            setScanned(false);
            scanningRef.current = false;
            // ❌ NO REMOUNT
          }}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.rescanButtonText}>Escanear Otro</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  middleRow: {
    flexDirection: "row",
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scanArea: {
    width: 300,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#FF7E33",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#FF7E33",
    shadowColor: "#FF7E33",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  bottomOverlay: {
    flex: 2,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionsContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  instructionsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  instructionsSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  rescanButton: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: [{ translateX: -100 }],
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
  },
  rescanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

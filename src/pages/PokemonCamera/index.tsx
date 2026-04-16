import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
// Importe a função do cache que você criou (Ajuste o caminho se necessário)
import { setCapturedPhotoUri } from '../../services/photoCache'; 

export default function PokemonCameraScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation(); // Para poder voltar à tela anterior

  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const route = useRoute<RouteProp<RootStackParamList, 'PokemonCamera'>>();
  const { id } = route.params;

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Precisamos da permissão da câmera.</Text>
        <TouchableOpacity style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionText}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleTakePhoto() {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
    });

    if (photo) {
      // 1. Salva a URI da foto no cache em memória passando o ID do Pokémon
      setCapturedPhotoUri(id, photo.uri);
      
      // 2. Volta para a tela de Detalhes automaticamente
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Text style={styles.actionText}>Tirar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
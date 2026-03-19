import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native'; // Ícones modernos

import Logo from '../../assets/logo.png';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  
  const isButtonDisabled = isLoading || !email || !password;

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulação de autenticação
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "PokemonList" }],
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Cabeçalho */}
        <View style={styles.boxTop}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.textTop}>Pokédex</Text>
        </View>

        {/* Formulário */}
        <View style={styles.boxMid}>
          <Text style={styles.titleInput}>E-mail</Text>
          <View style={styles.boxInput}>
            <Mail size={20} color={theme.colors.text} style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.colors.textSecondary + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.titleInput}>Senha</Text>
          <View style={styles.boxInput}>
            <Lock size={20} color={theme.colors.text} style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor={theme.colors.textSecondary + '80'}
              secureTextEntry
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Ação */}
        <View style={styles.boxBottom}>
          <TouchableOpacity 
            style={[styles.buttonEntrar, isButtonDisabled && { opacity: 0.6 }]} 
            onPress={handleLogin} 
            disabled={isButtonDisabled}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonEntrarText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
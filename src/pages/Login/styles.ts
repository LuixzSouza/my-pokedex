import { Dimensions, StyleSheet, Platform } from 'react-native';
import type { Theme } from '../../global/themes';

const { height } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // Ajustado para KeyboardAvoidingView funcionar melhor
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 30,
    },
    boxTop: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    logo: {
      height: 100,
      width: 100,
      resizeMode: 'contain',
    },
    textTop: {
      fontSize: 28,
      fontWeight: '900',
      marginTop: 15,
      color: theme.colors.text,
      letterSpacing: -1,
    },
    boxMid: {
      width: '100%',
    },
    titleInput: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginLeft: 5,
      marginBottom: 8,
      marginTop: 20,
    },
    boxInput: {
      width: '100%',
      height: 55, // Um pouco mais alto para melhor usabilidade
      borderWidth: 1.5,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground || theme.colors.surface,
      borderColor: theme.colors.border,
      paddingHorizontal: 15,
    },
    inputIcon: {
      marginRight: 10,
      opacity: 0.5,
    },
    textInput: {
      flex: 1,
      height: '100%',
      color: theme.colors.text,
      fontSize: 16,
    },
    boxBottom: {
      marginTop: 40,
      alignItems: 'center',
    },
    buttonEntrar: {
      width: '100%',
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
      borderRadius: 16,
      // Sombra leve
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    buttonEntrarText: {
      color: '#FFF', // Texto branco no botão de destaque
      fontWeight: 'bold',
      fontSize: 18,
    },
  });
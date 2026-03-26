import { StyleSheet, Dimensions } from 'react-native';
import type { Theme } from '../../global/themes';

const { width } = Dimensions.get('window');
// Calcula a largura do card considerando os paddings da tela e o gap entre as colunas
const CARD_WIDTH = (width - 60) / 2;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: theme.colors.text,
    },
    buttonLogout: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent + '20',
      borderRadius: 12,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface || '#FFF',
      borderRadius: 24,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardName: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'capitalize',
      color: theme.colors.text,
      marginTop: 12,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 4,
      marginTop: 8,
    },
    typeBadge: {
      backgroundColor: theme.colors.accent + '30',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    typeText: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: theme.colors.textSecondary,
    },
    cardImage: {
      width: 80,
      height: 80,
    },
    footerContainer: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 10,
      padding: 10,
    },
  });
import { StyleSheet, Dimensions } from 'react-native';
import type { Theme } from '../../global/themes';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingBottom: 40,
      paddingHorizontal: 16,
    },
    // Cabeçalho e informações do Pokémon
    header: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 8,
    },
    name: {
      fontSize: 36,
      fontWeight: '900',
      textTransform: 'capitalize',
      color: theme.colors.text,
    },
    id: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      opacity: 0.6,
    },
    typeContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
      marginBottom: 16,
      justifyContent: 'center',
    },
    typeBadge: {
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 6,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    typeText: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#FFF',
      letterSpacing: 1,
    },
    image: {
      width: 200,
      height: 200,
      zIndex: 2,
      marginVertical: 10,
    },
    // Seções de conteúdo (Sobre, Informações, Stats)
    section: {
      backgroundColor: theme.colors.background,
      marginBottom: 20,
      borderRadius: 24,
      padding: 20,
      // Efeito de card
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 12,
      color: theme.colors.text,
      letterSpacing: 0.5,
    },
    sectionText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    // Linhas de Informação (Altura e Peso)
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.textSecondary + '20',
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    infoValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    // Estilização dos Stats
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statName: {
      width: 80,
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'right',
    },
  });
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
    },
    // Cabeçalho superior com botão voltar e ID
    headerBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 10,
      zIndex: 10,
    },
    backButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '40', // Transparência de 40%
      borderWidth: 1,
      borderColor: theme.colors.accent,
    },
    backButtonText: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 14,
    },
    headerId: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      opacity: 0.6,
    },
    // Área de destaque do Pokémon
    pokemonHero: {
      alignItems: 'center',
      paddingVertical: 20,
      position: 'relative',
    },
    image: {
      width: 200,
      height: 200,
      zIndex: 2,
    },
    name: {
      fontSize: 36,
      fontWeight: '900',
      textTransform: 'capitalize',
      color: theme.colors.text,
      marginTop: -10,
    },
    typeContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    typeBadge: {
      backgroundColor: theme.colors.primary,
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
    // Card branco/principal que contém os dados
    infoCard: {
      backgroundColor: theme.colors.background, // ou uma cor de superfície levemente diferente
      marginTop: 20,
      marginHorizontal: 16,
      borderRadius: 32,
      padding: 24,
      // Efeito de elevação suave
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 16,
      color: theme.colors.text,
      letterSpacing: 0.5,
    },
    // Grid de Altura e Peso
    infoGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.accent + '15',
      borderRadius: 20,
      padding: 20,
    },
    infoBox: {
      alignItems: 'center',
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 4,
      fontWeight: '600',
    },
    infoValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    infoDivider: {
      width: 1,
      height: '100%',
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.2,
    },
    // Estilização dos Stats (Barras de progresso visual)
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    statName: {
      width: 60,
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    statValue: {
      width: 35,
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'right',
      marginRight: 10,
    },
    // Container da barra de progresso
    statBarBg: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.accent + '30',
      borderRadius: 4,
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
  });
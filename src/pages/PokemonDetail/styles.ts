// src/pages/PokemonDetail/styles.ts
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
    // CABEÇALHO
    header: {
      alignItems: 'center',
      paddingTop: 30,
      paddingBottom: 20,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 8,
    },
    name: {
      fontSize: 40,
      fontWeight: '900',
      textTransform: 'capitalize',
      color: theme.colors.text,
      letterSpacing: -1,
    },
    id: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      opacity: 0.5,
    },
    typeContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
      marginBottom: 20,
      justifyContent: 'center',
    },
    typeBadge: {
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 8,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    typeText: {
      fontSize: 14,
      fontWeight: '800',
      textTransform: 'uppercase',
      color: '#FFF',
      letterSpacing: 1.5,
    },
    imageContainer: {
      width: 250,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    image: {
      width: '100%',
      height: '100%',
      zIndex: 2,
    },

    // AÇÕES RÁPIDAS (Botões)
    actionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    actionButtonText: {
      fontWeight: '800',
      fontSize: 14,
    },

    // SEÇÕES GERAIS
    section: {
      backgroundColor: theme.colors.accent || '#F3F4F6', // Fundo sutil do card
      marginBottom: 20,
      borderRadius: 24,
      padding: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 16,
      color: theme.colors.text,
      letterSpacing: 0.5,
    },
    sectionText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      fontWeight: '500',
    },

    // GRID DE INFORMAÇÕES (Altura/Peso)
    infoGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    infoBlock: {
      flex: 1,
      backgroundColor: theme.colors.background, // Contraste interno
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 8,
    },
    infoValue: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.text,
    },

    // BARRAS DE STATUS (Base Stats)
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    statName: {
      width: 50, // Tamanho fixo para as siglas ficarem alinhadas
      fontSize: 12,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    statValue: {
      width: 40,
      fontSize: 14,
      fontWeight: '900',
      color: theme.colors.text,
      textAlign: 'right',
      marginRight: 12,
    },
    statBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.textSecondary + '30', // Fundo da barra transparente
      borderRadius: 4,
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: 4,
    },
  });
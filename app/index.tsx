import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.glowCircle} />
          <Text style={styles.brand}>HERMES<Text style={styles.brandAccent}>LINK</Text></Text>
          <Text style={styles.version}>OS v4.0 // OPERAÇÕES DE ESPAÇO PROFUNDO</Text>
        </View>

        <View style={styles.selectionContainer}>
          <Text style={styles.instruction}>SELECIONE O SETOR OPERACIONAL</Text>

          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.optionCard}
            onPress={() => router.push('/crew-selection')}
          >
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons name="rocket-launch" size={32} color="#00E5FF" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>EXPEDIÇÃO MARTE</Text>
              <Text style={styles.cardSubtitle}>INTERFACE DA TRIPULAÇÃO LOCAL</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.optionCard, styles.cardSecondary]}
            onPress={() => router.push('/earthcomand')}
          >
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons name="earth" size={32} color="#7000FF" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>COMANDO TERRA</Text>
              <Text style={styles.cardSubtitle}>OPERAÇÕES DE CONTROLE DE TERRA</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.statusIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>CONEXÃO DSN CRIPTOGRAFADA ATIVA</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 30,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  glowCircle: {
    width: 60,
    height: 6,
    backgroundColor: '#00E5FF',
    borderRadius: 3,
    marginBottom: 20,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  brandAccent: {
    fontWeight: '300',
    color: 'rgba(255,255,255,0.6)',
  },
  version: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 2,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.6,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSecondary: {
    borderColor: 'rgba(112, 0, 255, 0.2)',
  },
  cardIcon: {
    marginRight: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1,
  },
  footer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF41',
    marginRight: 10,
  },
  statusText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    letterSpacing: 1,
  },
});
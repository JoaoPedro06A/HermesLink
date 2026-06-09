import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CrewSelectionScreen() {
  const router = useRouter();

  const crewMembers = [
    {
      id: 'T-01',
      name: 'ANDERSON',
      role: 'COMANDANTE / GEÓLOGO',
      bpm: '72',
      o2: '98%',
      status: 'ESTÁVEL',
      color: '#00E5FF',
    },
    {
      id: 'T-02',
      name: 'MARTINS',
      role: 'ENGENHEIRO DE SISTEMAS',
      bpm: '104',
      o2: '94%',
      status: 'ALERTA',
      color: '#FF3D00',
    },
    {
      id: 'T-03',
      name: 'OLIVEIRA',
      role: 'PILOTO / MÉDICO',
      bpm: '68',
      o2: '99%',
      status: 'ESTÁVEL',
      color: '#00FF41',
    },
    {
      id: 'T-04',
      name: 'SOUZA',
      role: 'ESPECIALISTA EM BOTÂNICA',
      bpm: '85',
      o2: '97%',
      status: 'ESTÁVEL',
      color: '#FFCC00',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>IDENTIFIQUE-SE</Text>
          <Text style={styles.subtitle}>SELECIONE SEU PERFIL OPERACIONAL</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {crewMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              activeOpacity={0.8}
              style={[styles.card, { borderColor: member.color + '40' }]}
              onPress={() => router.push({
                pathname: '/crew',
                params: { name: member.name, id: member.id }
              })}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { borderColor: member.color }]}>
                  <MaterialCommunityIcons name="account" size={40} color={member.color} />
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.memberId}>{member.id}</Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>BPM</Text>
                  <Text style={[styles.statValue, { color: member.color }]}>{member.bpm}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>O2</Text>
                  <Text style={[styles.statValue, { color: member.color }]}>{member.o2}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>STATUS</Text>
                  <Text style={[styles.statValue, { color: member.color, fontSize: 10 }]}>{member.status}</Text>
                </View>
              </View>

              <View style={styles.actionButton}>
                <Text style={styles.actionText}>ACESSAR TERMINAL</Text>
                <MaterialCommunityIcons name="login" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05070A' },
  safeArea: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  backButton: { marginBottom: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 2, marginTop: 4 },
  scrollContent: { padding: 20, gap: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 20, backgroundColor: 'rgba(255,255,255,0.02)' },
  nameContainer: { flex: 1 },
  memberId: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' },
  memberName: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  memberRole: { color: '#00E5FF', fontSize: 10, marginTop: 2, opacity: 0.8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  stat: { alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 12, 
    borderRadius: 8, 
    gap: 10 
  },
  actionText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
});
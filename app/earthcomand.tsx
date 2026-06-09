import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';

// Substitua pelo IP da sua máquina se for testar no celular físico
const socket = io('http://localhost:3001');

export default function EarthCommandScreen() {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MÉDIA');
  const [newTaskStatus, setNewTaskStatus] = useState('PENDENTE');

  const [messages, setMessages] = useState([
    { id: 1, sender: 'TRIPULAÇÃO (MARTE)', text: 'Coleta de minerais finalizada. Aguardando análise.', type: 'in' },
    { id: 2, sender: 'VOCÊ (TERRA)', text: 'Confirmado. Inicie resfriamento do módulo.', type: 'out' },
  ]);

  const [missionStats, setMissionStats] = useState({
    oxygen: 88,
    energy: 94,
    water: 76,
  });

  const [crewStats, setCrewStats] = useState({
    anderson: { name: 'ANDERSON', id: 'T-01', bpm: 72, o2: 98, status: 'online' },
    martins: { name: 'MARTINS', id: 'T-02', bpm: 104, o2: 94, status: 'alert' },
    oliveira: { name: 'OLIVEIRA', id: 'T-03', bpm: 68, o2: 99, status: 'online' },
    souza: { name: 'SOUZA', id: 'T-04', bpm: 85, o2: 97, status: 'online' }
  });

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Calibração Sensores Lidar', priority: 'CRÍTICA', status: 'PENDENTE', color: '#FF3D00' },
    { id: 2, name: 'Coleta de Solo - Setor Delta', priority: 'ALTA', status: 'EM CURSO', color: '#FFCC00' },
  ]);

  const priorityOptions = [
    { label: 'CRÍTICA', color: '#FF3D00' },
    { label: 'ALTA', color: '#FFCC00' },
    { label: 'MÉDIA', color: '#00E5FF' },
    { label: 'BAIXA', color: '#00FF41' },
  ];

  useEffect(() => {
    // Escuta novas mensagens vindas de Marte
    socket.on('receive_message', (data: { origin: string; author: string; text: string }) => {
      console.log('Mensagem recebida em EarthControl:', data); // Adicione esta linha
      if (data.origin === 'CREW') {
        const incomingMsg = {
          id: Date.now(),
          sender: `MARTE (${data.author})`,
          text: data.text,
          type: 'in'
        };
        setMessages(prev => [...prev, incomingMsg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrewStats(prev => ({
        anderson: { 
          ...prev.anderson, 
          bpm: 70 + Math.floor(Math.random() * 5),
          o2: 97 + Math.floor(Math.random() * 2)
        },
        martins: { 
          ...prev.martins, 
          bpm: 100 + Math.floor(Math.random() * 10),
          o2: 93 + Math.floor(Math.random() * 2)
        },
        oliveira: {
          ...prev.oliveira,
          bpm: 65 + Math.floor(Math.random() * 5),
          o2: 98 + Math.floor(Math.random() * 2)
        },
        souza: {
          ...prev.souza,
          bpm: 80 + Math.floor(Math.random() * 8),
          o2: 96 + Math.floor(Math.random() * 2)
        }
      }));
      setMissionStats(prev => ({
        oxygen: Math.max(0, prev.oxygen + (Math.random() > 0.5 ? 0.1 : -0.1)),
        energy: Math.max(0, prev.energy - 0.05),
        water: Math.max(0, prev.water - 0.02),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'VOCÊ (TERRA)',
      text: messageInput,
      type: 'out'
    };
    
    // Envia para o backend (Marte)
    socket.emit('send_message', {
      author: 'HOUSTON',
      text: messageInput,
      origin: 'EARTH'
    });
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      Alert.alert("Erro", "O nome da tarefa não pode estar vazio.");
      return;
    }

    const selectedPrio = priorityOptions.find(p => p.label === newTaskPriority) || priorityOptions[2];
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      priority: newTaskPriority,
      status: newTaskStatus,
      color: selectedPrio.color
    };

    setTasks([newTask, ...tasks]);
    setNewTaskName('');
    setNewTaskPriority('MÉDIA');
    setNewTaskStatus('PENDENTE');
    setIsModalVisible(false);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Navigation Bar - Web Focused */}
        <View style={styles.topBar}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>HOUSTON // <Text style={{fontWeight: '300'}}>MISSION CONTROL</Text></Text>
          </View>
          <View style={styles.systemStatus}>
            <MaterialCommunityIcons name="broadcast" size={16} color="#00FF41" />
            <Text style={styles.systemStatusText}>DEEP SPACE NETWORK: ONLINE (DSN-1)</Text>
          </View>
        </View>

        <View style={styles.mainLayout}>
          
          {/* Column 1: Crew Health & Telemetry */}
          <View style={styles.sidePanel}>
            <Text style={styles.sectionTitle}>RECURSOS DA BASE</Text>
            <View style={styles.missionStatsMini}>
              <View style={styles.missionStatItem}>
                <View style={styles.statHeaderMini}>
                  <Text style={styles.statLabelMini}>SISTEMA DE OXIGÊNIO</Text>
                  <Text style={styles.statValueMini}>{missionStats.oxygen.toFixed(0)}%</Text>
                </View>
                <View style={styles.miniProgress}>
                  <View style={[styles.miniFill, { width: `${missionStats.oxygen}%`, backgroundColor: '#00E5FF' }]} />
                </View>
              </View>
              <View style={styles.missionStatItem}>
                <View style={styles.statHeaderMini}>
                  <Text style={styles.statLabelMini}>RESERVA DE ENERGIA</Text>
                  <Text style={styles.statValueMini}>{missionStats.energy.toFixed(0)}%</Text>
                </View>
                <View style={styles.miniProgress}>
                  <View style={[styles.miniFill, { width: `${missionStats.energy}%`, backgroundColor: '#7000FF' }]} />
                </View>
              </View>
              <View style={styles.missionStatItem}>
                <View style={styles.statHeaderMini}>
                  <Text style={styles.statLabelMini}>RESERVA HÍDRICA (ODS 11)</Text>
                  <Text style={styles.statValueMini}>{missionStats.water.toFixed(0)}%</Text>
                </View>
                <View style={styles.miniProgress}>
                  <View style={[styles.miniFill, { width: `${missionStats.water}%`, backgroundColor: '#00E5FF' }]} />
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>STATUS DA TRIPULAÇÃO</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(crewStats).map(([key, member]) => (
                <View key={key} style={styles.crewCard}>
                  <View style={styles.crewHeader}>
                    <MaterialCommunityIcons name="account-circle-outline" size={24} color="#7000FF" />
                    <Text style={styles.crewName}>{member.id}: {member.name}</Text>
                    <View style={[styles.liveDot, member.status === 'alert' && { backgroundColor: '#FF3D00' }]} />
                  </View>
                  <View style={styles.telemetryRow}>
                    <Text style={styles.telemetryLabel}>BPM: {member.bpm}</Text>
                    <Text style={styles.telemetryLabel}>O2: {member.o2}%</Text>
                  </View>
                  <View style={styles.miniProgress}>
                    <View style={[styles.miniFill, { width: `${member.o2}%` }]} />
                  </View>
                  {member.status === 'alert' && <Text style={styles.alertText}>ALERTA: ESTRESSE ELEVADO</Text>}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Column 2: Tasks & Mission Logs (Main Content) */}
          <View style={styles.contentArea}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>GESTÃO DE MISSÃO</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>+ NOVA INSTRUÇÃO</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.taskTable}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.columnLabel, { flex: 2 }]}>TAREFA</Text>
                  <Text style={styles.columnLabel}>PRIORIDADE</Text>
                  <Text style={styles.columnLabel}>STATUS</Text>
                  <Text style={[styles.columnLabel, { flex: 0.4, textAlign: 'center' }]}>AÇÃO</Text>
                </View>
                
                {tasks.map(task => (
                  <View key={task.id} style={styles.tableRow}>
                    <Text style={[styles.rowText, { flex: 2 }]}>{task.name}</Text>
                    <Text style={[styles.rowText, { color: task.color }]}>{task.priority}</Text>
                    <Text style={styles.rowText}>{task.status}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(task.id)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FF3D00" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>LOG DE DECISÕES</Text>
              <View style={styles.decisionLog}>
                <Text style={styles.logItem}>[14:20] Mudança de rota para Rover-Alpha aprovada.</Text>
                <Text style={styles.logItem}>[12:05] Protocolo de economia de energia ativado.</Text>
              </View>
            </ScrollView>
          </View>

          {/* Column 3: Communication & Latency Queue */}
          <View style={styles.commPanel}>
            <Text style={styles.sectionTitle}>COMUNICAÇÃO DSN</Text>
            <ScrollView style={styles.messageHistory}>
              {messages.map(msg => (
                <View key={msg.id} style={msg.type === 'in' ? styles.msgIn : styles.msgOut}>
                  <Text style={styles.msgLabel}>{msg.sender}</Text>
                  <Text style={styles.msgText}>{msg.text}</Text>
                </View>
              ))}
              <View style={styles.msgPending}>
                <MaterialCommunityIcons name="timer-sand" size={14} color="#7000FF" />
                <Text style={styles.pendingText}>TRANSMISSÃO EM CURSO... (RESTAM 14m)</Text>
              </View>
            </ScrollView>
            
            <View style={styles.inputArea}>
              <TextInput 
                placeholder="DIGITE INSTRUÇÃO..." 
                placeholderTextColor="rgba(255,255,255,0.2)"
                style={styles.input}
                value={messageInput}
                onChangeText={setMessageInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </SafeAreaView>

      {/* Modal para Nova Instrução */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NOVA INSTRUÇÃO DE MISSÃO</Text>
            
            <Text style={styles.inputLabel}>DESCRIÇÃO DA TAREFA</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Calibração de oxigênio..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />

            <Text style={styles.inputLabel}>NÍVEL DE PRIORIDADE</Text>
            <View style={styles.optionGrid}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => setNewTaskPriority(option.label)}
                  style={[
                    styles.optionButton,
                    newTaskPriority === option.label && { borderColor: option.color, backgroundColor: 'rgba(255,255,255,0.05)' }
                  ]}
                >
                  <Text style={[styles.optionButtonText, { color: option.color }]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>STATUS INICIAL</Text>
            <View style={styles.optionGrid}>
              {['PENDENTE', 'EM CURSO', 'FINALIZADO'].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setNewTaskStatus(status)}
                  style={[
                    styles.optionButton,
                    newTaskStatus === status && { borderColor: '#7000FF', backgroundColor: 'rgba(112, 0, 255, 0.1)' }
                  ]}
                >
                  <Text style={[styles.optionButtonText, { color: newTaskStatus === status ? '#7000FF' : '#FFFFFF' }]}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddTask}>
                <Text style={styles.confirmButtonText}>ENVIAR COMANDO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05070A' },
  safeArea: { flex: 1 },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(112, 0, 255, 0.2)' 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  systemStatus: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 4 },
  systemStatusText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginLeft: 8, letterSpacing: 1 },
  
  mainLayout: { flex: 1, flexDirection: 'row', padding: 10 },
  
  // Side Panel (Crew Health)
  sidePanel: { width: 280, padding: 10, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)' },
  missionStatsMini: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  missionStatItem: { marginBottom: 12 },
  statHeaderMini: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statLabelMini: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  statValueMini: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  sectionTitle: { color: '#7000FF', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  crewCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 8, marginBottom: 10 },
  crewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  crewName: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF41' },
  telemetryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  telemetryLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  miniProgress: { height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 5 },
  miniFill: { height: '100%', backgroundColor: '#7000FF' },
  alertText: { color: '#FF3D00', fontSize: 9, fontWeight: 'bold', marginTop: 8 },

  // Main Content (Tasks)
  contentArea: { flex: 3, padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  addButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: '#7000FF' },
  addButtonText: { color: '#7000FF', fontSize: 10, fontWeight: 'bold' },
  taskTable: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 15, backgroundColor: 'rgba(112, 0, 255, 0.1)' },
  columnLabel: { flex: 1, color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', opacity: 0.6 },
  tableRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowText: { flex: 1, color: '#FFFFFF', fontSize: 12 },
  deleteButton: { flex: 0.4, alignItems: 'center', justifyContent: 'center' },
  decisionLog: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 8 },
  logItem: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 8, fontFamily: 'monospace' },

  // Comms Panel
  commPanel: { width: 320, padding: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 8 },
  messageHistory: { flex: 1, marginBottom: 15 },
  msgIn: { alignSelf: 'flex-start', maxWidth: '85%', marginBottom: 15 },
  msgOut: { alignSelf: 'flex-end', maxWidth: '85%', marginBottom: 15, alignItems: 'flex-end' },
  msgLabel: { color: '#7000FF', fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  msgText: { color: '#FFFFFF', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 4 },
  msgPending: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(112, 0, 255, 0.05)', borderRadius: 4 },
  pendingText: { color: '#7000FF', fontSize: 10, marginLeft: 8, fontWeight: 'bold' },
  inputArea: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', color: '#FFFFFF', padding: 10, borderRadius: 4, fontSize: 12, borderWidth: 1, borderColor: 'rgba(112, 0, 255, 0.3)' },
  sendButton: { backgroundColor: '#7000FF', padding: 10, borderRadius: 4, justifyContent: 'center' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#0A0E14', width: '90%', maxWidth: 500, padding: 25, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(112, 0, 255, 0.3)' },
  modalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 2, marginBottom: 20, textAlign: 'center' },
  inputLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1, marginTop: 10 },
  modalInput: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    color: '#FFFFFF', 
    padding: 15, 
    borderRadius: 8, 
    fontSize: 14, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  optionButton: { flex: 1, minWidth: '30%', paddingVertical: 10, alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  optionButtonText: { fontSize: 10, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', gap: 15, marginTop: 20 },
  cancelButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  cancelButtonText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold' },
  confirmButton: { flex: 2, backgroundColor: '#7000FF', paddingVertical: 15, alignItems: 'center', borderRadius: 8 },
  confirmButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
});

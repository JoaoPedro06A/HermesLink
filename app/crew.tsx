import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function CrewScreen() {
  const router = useRouter();
  const { name, id } = useLocalSearchParams();
  const [oxygen, setOxygen] = useState(88);
  const [energy, setEnergy] = useState(94);
  const [bpm, setBpm] = useState(72);
  const [statusText, setStatusText] = useState('ESTÁVEL');
  const [currentName, setCurrentName] = useState(name || 'TRIPULANTE');
  const [currentId, setCurrentId] = useState(id || 'T-00');

  const [messageInput, setMessageInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'CONTROLE DA TERRA', text: 'Confirmação recebida sobre a coleta de minerais no Setor Delta. Prossiga com o protocolo.', type: 'in', time: 'HÁ 2H' },
    { id: 2, sender: 'VOCÊ', text: 'Protocolo de resfriamento iniciado. Aguardando novas instruções.', type: 'out', time: 'HÁ 1H' },
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Calibrar antenas de banda X', completed: false },
    { id: 2, text: 'Verificar níveis de radiação no hangar', completed: true },
    { id: 3, text: 'Relatório de amostras geológicas', completed: false },
  ]);

  // Simulação de flutuação de recursos
  useEffect(() => {
    const interval = setInterval(() => {
      setOxygen(prev => Math.max(0, prev + (Math.random() > 0.5 ? 0.1 : -0.1)));
      setEnergy(prev => Math.max(0, prev - 0.05));
      setBpm(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('receive_message', (data: { origin: string; text: string; author: string }) => {
      if (data.origin === 'EARTH') {
        const incomingMsg = {
          id: Date.now(),
          sender: 'CONTROLE DA TERRA',
          text: data.text,
          type: 'in',
          time: 'AGORA'
        };
        setMessages(prev => [...prev, incomingMsg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNewTask = () => {
    // Nota: Alert.prompt é uma funcionalidade nativa do iOS. 
    Alert.prompt("Nova Tarefa Operacional", "Descreva a atividade para este SOL:", (text) => {
      if (text) {
        setTasks([...tasks, { id: Date.now(), text, completed: false }]);
      }
    });
  };

  const editOxygen = () => {
    // Nota: Alert.prompt é nativo do iOS. Para Android/Web, valores fixos ou um Modal seriam usados.
    Alert.prompt(
      "Ajustar Oxigênio",
      "Digite o nível atual do sistema (0-100):",
      (text) => {
        const val = parseFloat(text);
        if (!isNaN(val) && val >= 0 && val <= 100) setOxygen(val);
      },
      'plain-text',
      oxygen.toFixed(0)
    );
  };

  const editBpm = () => {
    Alert.prompt(
      "Monitor Cardíaco",
      "Ajustar frequência (BPM):",
      (text) => {
        const val = parseInt(text);
        if (!isNaN(val)) setBpm(val);
      },
      'plain-text',
      bpm.toString()
    );
  };

  const editStatusText = () => {
    Alert.prompt(
      "Status Operacional",
      "Defina a situação atual (ex: ESTÁVEL, ALERTA, CRÍTICO):",
      (text) => {
        if (text) setStatusText(text.toUpperCase());
      },
      'plain-text',
      statusText
    );
  };

  const editProfile = () => {
    Alert.prompt(
      "Editar Perfil",
      "Digite o novo nome do astronauta:",
      (newName) => {
        if (newName) {
          setCurrentName(newName.toUpperCase());
          Alert.prompt(
            "Identificação",
            "Digite o novo ID (ex: T-01):",
            (newId) => {
              if (newId) setCurrentId(newId.toUpperCase());
            }
          );
        }
      }
    );
  };

  const editEnergy = () => {
    Alert.prompt(
      "Ajustar Energia",
      "Digite a carga atual das baterias (0-100):",
      (text) => {
        const val = parseFloat(text);
        if (!isNaN(val) && val >= 0 && val <= 100) setEnergy(val);
      },
      'plain-text',
      energy.toFixed(0)
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'VOCÊ',
      text: messageInput,
      type: 'out',
      time: 'AGORA'
    };

    // Envia para o backend
    socket.emit('send_message', {
      author: currentName,
      text: messageInput,
      origin: 'CREW'
    });

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header com Voltar e SOL (Dia Marciano) */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SOL 142</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
          
          {/* Boas-vindas */}
          <TouchableOpacity style={styles.welcomeSection} onPress={editProfile} activeOpacity={0.7}>
            <Text style={styles.welcomeText}>
              BEM-VINDO, <Text style={styles.crewName}>{currentName}</Text>
              <Text style={styles.memberId}> [{currentId}]</Text>
            </Text>
            <Text style={styles.locationText}>BASE CRATERA JEZERO // MARTE (EDITAR PERFIL)</Text>
          </TouchableOpacity>

          {/* Comunicação DSN */}
          <View style={[styles.section, styles.cardContainer, { borderColor: 'rgba(112, 0, 255, 0.8)', borderWidth: 2 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>COMUNICAÇÃO DSN</Text>
              <Text style={styles.latencyText}>LATÊNCIA: 14m 22s</Text>
            </View>
            <ScrollView style={styles.messageHistory} ref={scrollViewRef}>
              {messages.map(msg => (
                <View key={msg.id} style={msg.type === 'in' ? styles.msgIn : styles.msgOut}>
                  <Text style={styles.msgLabel}>{msg.sender}</Text>
                  <Text style={styles.msgText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.inputArea}>
              <TextInput placeholder="DIGITE MENSAGEM..." placeholderTextColor="rgba(255,255,255,0.2)" style={styles.input} value={messageInput} onChangeText={setMessageInput} />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status da Missão (Telemetria) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STATUS DA MISSÃO</Text>
            <View style={styles.grid}>
              <TouchableOpacity style={styles.statusBox} onPress={editOxygen} activeOpacity={0.7}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusLabel}>OXIGÊNIO</Text>
                  <MaterialCommunityIcons name="pencil-outline" size={10} color="rgba(255,255,255,0.2)" />
                </View>
                <Text style={styles.statusValue}>{oxygen.toFixed(0)}%</Text>
                <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${oxygen}%` }]} /></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statusBox} onPress={editEnergy} activeOpacity={0.7}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusLabel}>ENERGIA</Text>
                  <MaterialCommunityIcons name="pencil-outline" size={10} color="rgba(255,255,255,0.2)" />
                </View>
                <Text style={styles.statusValue}>{energy.toFixed(0)}%</Text>
                <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${energy}%`, backgroundColor: '#7000FF' }]} /></View>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.grid, { marginTop: 15 }]}>
              <TouchableOpacity style={styles.statusBox} onPress={editBpm} activeOpacity={0.7}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusLabel}>FREQ. CARDÍACA</Text>
                  <MaterialCommunityIcons name="heart-pulse" size={12} color="#FF3D00" />
                </View>
                <Text style={styles.statusValue}>{bpm} <Text style={{fontSize: 12, fontWeight: '300'}}>BPM</Text></Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statusBox} onPress={editStatusText} activeOpacity={0.7}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusLabel}>SITUAÇÃO</Text>
                  <MaterialCommunityIcons name="information-outline" size={12} color="#00E5FF" />
                </View>
                <Text style={[styles.statusValue, { fontSize: 18, marginTop: 12 }]}>{statusText}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tarefas Operacionais */}
          <View style={[styles.section, styles.cardContainer, { borderColor: 'rgba(0, 229, 255, 0.3)' }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>TAREFAS DO DIA</Text>
              <TouchableOpacity onPress={addNewTask} style={styles.addTaskButton}>
                <MaterialCommunityIcons name="plus-box" size={20} color="#00E5FF" />
              </TouchableOpacity>
            </View>
            {tasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskItem} 
                onPress={() => toggleTask(task.id)}
              > 
                <MaterialCommunityIcons 
                  name={task.completed ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={20} 
                  color={task.completed ? "rgba(0, 229, 255, 0.3)" : "#00E5FF"} 
                />
                <Text style={[styles.taskText, task.completed && styles.taskDone]}>{task.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Alertas de Sistema */}
          <View style={[styles.section, styles.cardContainer, { borderColor: 'rgba(255, 61, 0, 0.4)' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="alert" size={18} color="#FF3D00" />
              <Text style={[styles.sectionTitle, { color: '#FF3D00' }]}>ALERTAS DE SISTEMA</Text>
            </View>
            <View style={styles.alertCard}>
              <Text style={styles.alertTitle}>PRESSÃO DO TRAJE BAIXA</Text>
              <Text style={styles.alertMeta}>VERIFICAR VÁLVULA DE OXIGÊNIO SECUNDÁRIA</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05070A' },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  badge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: '#00E5FF', fontSize: 12, fontWeight: 'bold' },
  
  welcomeSection: { 
    marginVertical: 15, 
    padding: 20, 
    backgroundColor: 'rgba(0, 229, 255, 0.05)', 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginBottom: 25
  },
  welcomeText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, letterSpacing: 2 },
  crewName: { color: '#FFFFFF', fontWeight: 'bold' },
  memberId: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'normal' },
  locationText: { color: '#00E5FF', fontSize: 10, marginTop: 4, letterSpacing: 1 },

  section: { marginBottom: 25 },
  cardContainer: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', letterSpacing: 2, opacity: 0.8 },
  
  alertCard: {
    backgroundColor: 'rgba(255, 61, 0, 0.1)',
    padding: 16,
    borderRadius: 8,
  },
  alertTitle: { color: '#FF3D00', fontWeight: 'bold', fontSize: 14 },
  alertMeta: { color: 'rgba(255, 61, 0, 0.7)', fontSize: 11, marginTop: 4 },

  grid: { flexDirection: 'row', gap: 15 },
  statusBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1 },
  statusValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginVertical: 5 },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00E5FF' },

  latencyText: { color: 'rgba(255,255,255,0.3)', fontSize: 9 },
  messageHistory: { maxHeight: 220, marginBottom: 15 }, 
  msgIn: { alignSelf: 'flex-start', maxWidth: '85%', marginBottom: 15 },
  msgOut: { alignSelf: 'flex-end', maxWidth: '85%', marginBottom: 15, alignItems: 'flex-end' },
  msgLabel: { color: '#7000FF', fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  msgText: { color: '#FFFFFF', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 4 },
  messageTime: { color: 'rgba(255,255,255,0.2)', fontSize: 9, marginTop: 10, textAlign: 'right' },
  inputArea: { flexDirection: 'row', gap: 10 },
  input: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    color: '#FFFFFF', 
    padding: 10, 
    borderRadius: 4, 
    fontSize: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(112, 0, 255, 0.7)' 
  },
  sendButton: { backgroundColor: '#7000FF', padding: 10, borderRadius: 4, justifyContent: 'center' },

  addTaskButton: { padding: 4 },
  taskItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 16, 
    borderRadius: 8,
    marginBottom: 8
  },
  taskText: { color: '#FFFFFF', marginLeft: 12, fontSize: 14 },
  taskDone: { opacity: 0.3, textDecorationLine: 'line-through' },
});

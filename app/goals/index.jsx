import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import useGoals from '../../hooks/useGoals';

const Goals = () => {
  const { goals, deleteGoal, updateGoal, createGoal } = useGoals();
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState('All');

  const handleProgressChange = async (value) => {
    await updateGoal(selected.id, { progress: value });
  };

  const handleTitleChange = async () => {
    await updateGoal(selected.id, { goal: selected.goal });
  };

  const handleDelete = async () => {
    if (selected) {
      await deleteGoal(selected.id);
      setSelected(null);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await createGoal({ goal: newGoal, description: newDescription, progress: 0 });
    setNewGoal('');
    setNewDescription('');
    setModalVisible(false);
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'Completed') return goal.progress === 100;
    if (filter === 'Pending') return goal.progress < 100;
    return true; // All
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Goals</Text>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        {['All', 'Completed', 'Pending'].map((type) => (
          <Pressable
            key={type}
            onPress={() => setFilter(type)}
            style={[
              styles.filterBtn,
              filter === type && styles.filterBtnActive,
            ]}
          >
            <Text style={{ color: filter === type ? 'white' : '#333' }}>{type}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            <View style={styles.goal}>
              <Text style={styles.goalTitle}>{item.goal}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <View style={[styles.progress, { width: `${item.progress || 0}%` }]} />
            </View>
          </Pressable>
        )}
      />

      <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={28} color="white" />
        <Text style={{ color: 'white', marginLeft: 10 }}>Add Goal</Text>
      </Pressable>

      {/* ➕ Add Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.modalHeader}>Add a New Goal</Text>
          <TextInput
            placeholder="Goal title"
            value={newGoal}
            onChangeText={setNewGoal}
            style={styles.input}
          />
          <TextInput
            placeholder="Description (optional)"
            value={newDescription}
            onChangeText={setNewDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <Pressable style={styles.saveBtn} onPress={handleAddGoal}>
            <Text style={{ color: 'white' }}>Save Goal</Text>
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* ✏️ Edit Goal Modal */}
      {selected && (
        <Modal visible animationType="slide" onRequestClose={() => setSelected(null)}>
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>Edit Goal</Text>

            <TextInput
              style={styles.editInput}
              value={selected.goal}
              onChangeText={(text) => setSelected({ ...selected, goal: text })}
            />

            <Text>Progress:</Text>
            <Slider
              style={{ width: '80%', height: 40, marginVertical: 20 }}
              value={selected.progress || 0}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#4caf50"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#4caf50"
              onSlidingComplete={handleProgressChange}
            />

            <Pressable
              style={[styles.btn, { backgroundColor: '#007bff', marginBottom: 10 }]}
              onPress={handleTitleChange}
            >
              <Text style={{ color: 'white' }}>Save Title</Text>
            </Pressable>

            <View style={styles.buttonsWrapper}>
              <Pressable style={styles.btn} onPress={() => setSelected(null)}>
                <Text style={{ color: 'white' }}>Close</Text>
              </Pressable>

              <Pressable style={[styles.btn, { backgroundColor: 'red' }]} onPress={handleDelete}>
                <Text style={{ color: 'white' }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 10 },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: '#21cc8d',
    borderColor: '#21cc8d',
  },

  goal: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 30,
    overflow: 'hidden',
    padding: 16,
  },
  goalTitle: { fontSize: 16, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#555', marginTop: 4 },
  progress: {
    height: 10,
    backgroundColor: '#4caf50',
    minWidth: 10,
    borderRadius: 2,
    marginTop: 10,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#21cc8d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  modal: { flex: 1, padding: 20, marginTop: 60, alignItems: 'center' },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    width: '80%',
  },
  editInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '80%',
    textAlign: 'center',
    paddingVertical: 5,
  },
  saveBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  cancelBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ccc',
    width: '80%',
  },
  buttonsWrapper: {
    width: '80%',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#21cc8d',
    minWidth: 100,
    alignItems: 'center',
  },
});
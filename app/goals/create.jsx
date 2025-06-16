import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import useGoals from '../../hooks/useGoals';
import { useFocusEffect } from '@react-navigation/native';

const CreateGoalScreen = () => {
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { createGoal } = useGoals();
  const router = useRouter();

  const handleCreate = async () => {
    if (!goal.trim() || !description.trim()) {
      Alert.alert('Missing Fields', 'Please fill out both the title and description.');
      return;
    }

    try {
      setLoading(true);
      await createGoal({ goal: goal.trim(), description: description.trim(), progress: 0 });
      Alert.alert('Success', 'Goal created successfully!', [
        { text: 'OK', onPress: () => router.push('/goals') }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong while creating the goal.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setGoal('');
      setDescription('');
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Text style={styles.heading}>Create a New Goal</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter goal title"
          value={goal}
          onChangeText={setGoal}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter goal description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Pressable
          style={[styles.button, loading && { backgroundColor: '#999' }]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Submit'}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateGoalScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#21cc8d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

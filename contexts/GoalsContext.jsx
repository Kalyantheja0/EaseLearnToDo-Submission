import React, { createContext, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const GoalsContext = createContext();

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);

  // 🔁 Real-time listener for goals
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'goals'), (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // ➕ Create a new goal
  async function createGoal(goalData) {
    try {
      await addDoc(collection(db, 'goals'), goalData);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  }

  // ❌ Delete a goal
  async function deleteGoal(id) {
    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  }

  // ✏️ Update a goal
  async function updateGoal(id, updatedData) {
    try {
      await updateDoc(doc(db, 'goals', id), updatedData);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  }

  return (
    <GoalsContext.Provider
      value={{
        goals,
        createGoal,
        deleteGoal,
        updateGoal,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}
export const useGoals = () => {
  const context = React.useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};


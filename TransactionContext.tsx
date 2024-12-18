import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(1000);
  const [recipients, setRecipients] = useState([]);

  const addTransaction = (amount, account) => {
    const newTransaction = { id: Date.now(), amount: parseFloat(amount), account };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    setBalance((prevBalance) => prevBalance - parseFloat(amount));
    setRecipients((prevRecipients) => [...prevRecipients, account.name]);
  };

  useEffect(() => {
    const loadData1 = async () => {
      const storedData1 = await AsyncStorage.getItem('transactions');
      if (storedData1) {
        setTransactions(JSON.parse(storedData1));
      }
    };
    const loadData2 = async () => {
      const storedData2 = await AsyncStorage.getItem('balance');
      if (storedData2) {
        setBalance(parseFloat(storedData2));
      }
    };
    const loadData3 = async () => {
      const storedData3 = await AsyncStorage.getItem('recipients');
      if (storedData3) {
        setRecipients(JSON.parse(storedData3));
      }
    };
    loadData1();
    loadData2();
    loadData3();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    AsyncStorage.setItem('balance', balance.toString());
    AsyncStorage.setItem('recipients', JSON.stringify(recipients));
  }, [transactions, balance, recipients]);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, balance, recipients }}>
      {children}
    </TransactionContext.Provider>
  );
};
import React, { useState } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Alert, View, TextInput, Button, Text } from 'react-native';
import { useTransactions } from './TransactionContext';
import { isValid } from 'iban';

const TransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const { addTransaction, recipients } = useTransactions();

  const handleTransaction = () => {
    const accountDetails = { name, iban };
    if (!isValid(iban)) {
        Alert.alert('Invalid IBAN', 'Please enter a valid IBAN.');
        return;
    }
    addTransaction(amount, accountDetails);
    navigation.goBack();
  };
  const [isFocused, setIsFocused] = useState(false);

  const handleSelectRecipient = (name) => {
    // Alert.alert("name");
    setName(name);
    setIsFocused(false);
  };

  const handleAddNewRecipient = () => {
    setIsFocused(false);
  };
  return (
    <View style={styles.formContainer}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginVertical: 8 }}
        onChangeText={setAmount}
        value={amount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginVertical: 8 }}
        onChangeText={setName}
        value={name}
        onFocus={() => setIsFocused(true)} // Hiển thị danh sách khi focus
        onBlur={handleAddNewRecipient} // Xử lý thêm mới khi mất focus
        placeholder="Recipient Name"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginVertical: 8 }}
        onChangeText={setIban}
        value={iban}
        placeholder="Recipient IBAN"
      />
      <Button title="Submit Transaction" onPress={handleTransaction} />
      {isFocused && (
        <View>
        <Text style={styles.historyTitle}>Recipients History:</Text>
        <FlatList
          data={recipients.filter((name) =>
            name.toLowerCase().includes(name.toLowerCase())
          )} // Lọc danh sách theo input
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleSelectRecipient(item)} // Gọi hàm và truyền giá trị
            >
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formContainer: {
    position: 'absolute', // Đặt form luôn cố định
    top: 0, // Neo form vào đỉnh màn hình
    left: 0,
    right: 0,
    backgroundColor: '#ffffff', // Nền trắng cho form
    padding: 20,
    zIndex: 10, // Đảm bảo form hiển thị phía trên các thành phần khác
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Viền ngăn cách form với phần dưới
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', // Màu chữ
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
  },
});

export default TransactionScreen;

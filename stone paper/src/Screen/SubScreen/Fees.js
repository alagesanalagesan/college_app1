import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Fees({ navigation }){

    const handleBackPress = () => {  
        navigation.goBack();   
    }

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');

    // Sample fee data
    const feeDetails = {
        tuitionFee: 50000,
        hostelFee: 15000,
        libraryFee: 2000,
        labFee: 3000,
        totalAmount: 70000,
        dueDate: "2023-12-31",
        academicYear: "2023-2024"
    };

    // Payment methods
    const paymentMethods = [
        {
            id: 1,
            name: "Credit Card",
            icon: "card",
            description: "Pay with Visa, MasterCard, or RuPay",
            color: "#007AFF"
        },
        {
            id: 2,
            name: "Debit Card",
            icon: "card-outline",
            description: "Pay using your debit card",
            color: "#34C759"
        },
        {
            id: 3,
            name: "UPI",
            icon: "phone-portrait",
            description: "Google Pay, PhonePe, Paytm",
            color: "#5856D6"
        },
        {
            id: 4,
            name: "Net Banking",
            icon: "business",
            description: "Internet banking",
            color: "#FF9500"
        },
        {
            id: 5,
            name: "Wallet",
            icon: "wallet",
            description: "Paytm, PhonePe, Amazon Pay",
            color: "#FF3B30"
        }
    ];

    // Recent transactions
    const recentTransactions = [
        {
            id: 1,
            type: "Tuition Fee",
            amount: 25000,
            date: "2023-09-15",
            status: "Completed",
            method: "UPI"
        },
        {
            id: 2,
            type: "Hostel Fee",
            amount: 7500,
            date: "2023-08-10",
            status: "Completed",
            method: "Net Banking"
        },
        {
            id: 3,
            type: "Library Fee",
            amount: 1000,
            date: "2023-07-05",
            status: "Failed",
            method: "Credit Card"
        }
    ];

    const handlePayment = () => {
        if (!selectedPaymentMethod) {
            Alert.alert("Select Payment Method", "Please select a payment method to continue.");
            return;
        }

        // Simulate payment processing
        setPaymentStatus('processing');
        
        setTimeout(() => {
            setPaymentStatus('completed');
            Alert.alert(
                "Payment Successful", 
                `Your payment of ₹${feeDetails.totalAmount.toLocaleString()} has been processed successfully.`,
                [
                    {
                        text: "OK",
                        onPress: () => setPaymentStatus('pending')
                    }
                ]
            );
        }, 3000);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return '#34C759';
            case 'Processing': return '#FF9500';
            case 'Failed': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    const renderFeeItem = (label, amount) => (
        <View key={label} style={styles.feeItem}>
            <Text style={styles.feeLabel}>{label}</Text>
            <Text style={styles.feeAmount}>₹{amount.toLocaleString()}</Text>
        </View>
    );

    const renderTransaction = (transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <Text style={styles.transactionMethod}>{transaction.method}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={styles.transactionAmountText}>₹{transaction.amount.toLocaleString()}</Text>
                <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
                    {transaction.status}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fees & Payments</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Fee Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Fee Summary</Text>
                    <Text style={styles.academicYear}>{feeDetails.academicYear}</Text>
                    
                    <View style={styles.feeBreakdown}>
                        {renderFeeItem("Tuition Fee", feeDetails.tuitionFee)}
                        {renderFeeItem("Hostel Fee", feeDetails.hostelFee)}
                        {renderFeeItem("Library Fee", feeDetails.libraryFee)}
                        {renderFeeItem("Lab Fee", feeDetails.labFee)}
                        
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>₹{feeDetails.totalAmount.toLocaleString()}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.dueDateContainer}>
                        <Ionicons name="calendar" size={16} color="#FF3B30" />
                        <Text style={styles.dueDate}>Due Date: {feeDetails.dueDate}</Text>
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentMethod,
                                selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethod
                            ]}
                            onPress={() => setSelectedPaymentMethod(method)}
                        >
                            <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                                <Ionicons name={method.icon} size={20} color="#FFF" />
                            </View>
                            <View style={styles.methodInfo}>
                                <Text style={styles.methodName}>{method.name}</Text>
                                <Text style={styles.methodDescription}>{method.description}</Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedPaymentMethod?.id === method.id && styles.radioButtonSelected
                            ]}>
                                {selectedPaymentMethod?.id === method.id && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Transactions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map(renderTransaction)
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color="#C7C7CC" />
                            <Text style={styles.emptyStateText}>No transactions found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Payment Footer */}
            <View style={styles.footer}>
                <View style={styles.footerAmount}>
                    <Text style={styles.footerLabel}>Total to Pay</Text>
                    <Text style={styles.footerTotal}>₹{feeDetails.totalAmount.toLocaleString()}</Text>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.payButton,
                        paymentStatus === 'processing' && styles.payButtonProcessing
                    ]}
                    onPress={handlePayment}
                    disabled={paymentStatus === 'processing'}
                >
                    {paymentStatus === 'processing' ? (
                        <>
                            <Ionicons name="refresh" size={20} color="#FFF" />
                            <Text style={styles.payButtonText}>Processing...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="lock-closed" size={20} color="#FFF" />
                            <Text style={styles.payButtonText}>Pay Now</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    academicYear: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 16,
    },
    feeBreakdown: {
        marginBottom: 16,
    },
    feeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    feeLabel: {
        fontSize: 16,
        color: '#000',
    },
    feeAmount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 2,
        borderTopColor: '#007AFF',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#007AFF',
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF2F2',
        padding: 12,
        borderRadius: 8,
    },
    dueDate: {
        fontSize: 14,
        color: '#FF3B30',
        fontWeight: '500',
        marginLeft: 8,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedPaymentMethod: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    methodIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 2,
    },
    methodDescription: {
        fontSize: 12,
        color: '#8E8E93',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#C7C7CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#007AFF',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2,
    },
    transactionMethod: {
        fontSize: 12,
        color: '#8E8E93',
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    transactionAmountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    transactionStatus: {
        fontSize: 12,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    footerAmount: {
        flex: 1,
    },
    footerLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 4,
    },
    footerTotal: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    payButtonProcessing: {
        backgroundColor: '#FF9500',
    },
    payButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
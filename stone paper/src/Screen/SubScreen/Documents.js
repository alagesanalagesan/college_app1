import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Documents({ navigation }){
    
    const handleBackPress = () => {  
        navigation.goBack();   
    }

    // Mock data - replace with your actual data
    const uploadedDocuments = [
        {
            id: 1,
            name: "Study Material 1.pdf",
            type: "PDF",
            size: "2.4 MB",
            uploadDate: "2023-10-15"
        },
        {
            id: 2,
            name: "Lecture Notes.docx",
            type: "DOCX",
            size: "1.8 MB",
            uploadDate: "2023-10-10"
        },
        {
            id: 3,
            name: "Assignment.pdf",
            type: "PDF",
            size: "3.1 MB",
            uploadDate: "2023-10-05"
        }
    ];

    const studyMaterials = [
        {
            id: 1,
            name: "Mathematics Textbook",
            type: "PDF",
            available: true
        },
        {
            id: 2,
            name: "Physics Guide",
            type: "PDF", 
            available: true
        },
        {
            id: 3,
            name: "Chemistry Notes",
            type: "DOCX",
            available: false
        }
    ];

    const renderDocumentItem = (document) => (
        <View key={document.id} style={styles.documentItem}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{document.name}</Text>
                <Text style={styles.documentDetails}>
                    {document.type} • {document.size} • {document.uploadDate}
                </Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download" size={20} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    const renderStudyMaterial = (material) => (
        <View key={material.id} style={styles.materialItem}>
            <Ionicons 
                name={material.available ? "book" : "book-outline"} 
                size={24} 
                color={material.available ? "#34C759" : "#8E8E93"} 
            />
            <View style={styles.materialInfo}>
                <Text style={[
                    styles.materialName,
                    !material.available && styles.unavailableText
                ]}>
                    {material.name}
                </Text>
                <Text style={styles.materialType}>{material.type}</Text>
            </View>
            <View style={styles.availability}>
                <Text style={[
                    styles.availabilityText,
                    material.available ? styles.available : styles.unavailable
                ]}>
                    {material.available ? "Available" : "Not Uploaded"}
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
                <Text style={styles.headerTitle}>Documents & Materials</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Uploaded Documents Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Uploaded Documents</Text>
                    {uploadedDocuments.length > 0 ? (
                        uploadedDocuments.map(renderDocumentItem)
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-outline" size={64} color="#C7C7CC" />
                            <Text style={styles.emptyStateText}>No documents uploaded yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Your uploaded documents will appear here
                            </Text>
                        </View>
                    )}
                </View>

                {/* Study Materials Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Study Materials</Text>
                    {studyMaterials.map(renderStudyMaterial)}
                </View>

                {/* Upload Button */}
                <TouchableOpacity style={styles.uploadButton}>
                    <Ionicons name="cloud-upload" size={20} color="#FFF" />
                    <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        marginTop:60
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
    section: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#000',
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    documentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    documentDetails: {
        fontSize: 14,
        color: '#8E8E93',
    },
    downloadBtn: {
        padding: 8,
    },
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    materialInfo: {
        flex: 1,
        marginLeft: 12,
    },
    materialName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    unavailableText: {
        color: '#8E8E93',
    },
    materialType: {
        fontSize: 14,
        color: '#8E8E93',
    },
    availability: {
        marginLeft: 'auto',
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '500',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    available: {
        backgroundColor: '#D8F8E3',
        color: '#1F7B44',
    },
    unavailable: {
        backgroundColor: '#F2F2F7',
        color: '#8E8E93',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#8E8E93',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#C7C7CC',
        textAlign: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
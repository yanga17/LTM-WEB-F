'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer'
import { CustomerErrorResponse } from '../../modules/reports/customerErrorsReport'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  table: {
    display: "flex",
    width: "auto",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row"
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  tableCol: {
    width: "25%", // Fixed width for each column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColCustomer: {
    width: "70%", // Extended width for the Customer column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColError: {
    width: "60%", // Extended width for the Customer column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColHeader: {
    backgroundColor: "#04AA6D",
    color: "white",
    paddingTop: 2,
    paddingBottom: 2,
  },
  evenRow: {
    backgroundColor: "#f2f2f2",
  },
  hoverRow: {
    backgroundColor: "#ddd",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  }
});

//const headers = ['Call ID', 'Error', 'Customer', 'No. Times Counted']

interface Props {
  data: CustomerErrorResponse,
  starttime: string,
  endtime: string
}

export const CustomerErrorsPDF = ({ data, starttime, endtime }: Props) => {

  const startimeFormatted = new Date(starttime).toLocaleString();
  const endTimeFormatted = new Date(endtime).toLocaleString();
  
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Text style={styles.header}>Common Customer Errors Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text> {/* Added info text with formatted date and time */}
        <img></img>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColCustomer, styles.tableColHeader]}>
              <Text>Errors</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>Error Count</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColCustomer, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
                <Text>{row.Customer}</Text>
              </View>
              <View style={[styles.tableCol, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
                <Text>{row.ErrorCount}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

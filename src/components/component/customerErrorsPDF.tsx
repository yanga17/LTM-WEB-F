'use client'

import React from 'react';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import { CustomerErrorResponse } from '../../modules/reports/customerErrorsReport';
// import Image from 'next/image';

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
    textAlign: "center",
  },
  tableColCustomer: {
    width: "70%", // Extended width for the Customer column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "center",
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
  },
  image: {
    // marginBottom: 20,
    width: 200,
    height: 30,
    float: 'left',
  },
  footerText: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 10,
  }
});

//const headers = ['Call ID', 'Error', 'Customer', 'No. Times Counted']

interface Props {
  data: CustomerErrorResponse,
  starttime: string,
  endtime: string
}

export const CustomerErrorsPDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toString().split(' ').slice(1, 5).join(' ');
  const endTimeFormatted = new Date(endtime).toString().split(' ').slice(1, 5).join(' ');
  
  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Image style={styles.image} src="/covers/legendSystems.png" />
        <Text style={styles.header}>Common Customer Errors Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>No.</Text>
            </View>
            <View style={[styles.tableColCustomer, styles.tableColHeader]}>
              <Text>Customer</Text>
            </View>
            <View style={[styles.tableColCustomer, styles.tableColHeader]}>
              <Text>Errors</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>Count</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableCol]}>
                <Text>{rowIndex + 1}</Text>
              </View>
              <View style={[styles.tableColCustomer]}>
                <Text>{row.Customer.toLocaleUpperCase()}</Text>
              </View>
              <View style={[styles.tableColCustomer]}>
                <Text>{row.Activity.toLocaleUpperCase()}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text>{row.ErrorCount}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.footerText}>Customer Errors</Text> {/* Added footer text */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

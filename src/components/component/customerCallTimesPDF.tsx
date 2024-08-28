'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer'
import { CallTimesResponse } from '../../modules/reports/customerCallTimesReport'

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
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  tableCol: {
    width: "250px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColCustomer: {
    width: "500px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word',
  },
  tableColActivity: {
    width: "520px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColComments: {
    width: "500px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word', // Ensure long texts are wrapped
  },
  tableColPhoneNo: {
    width: "350px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word',
  },
  tableColDuration: {
    width: "350px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word',
  },
  tableColStartTime: {
    width: "485px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word',
  },
  tableColEndTime: {
    width: "485px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word',
  },
  tableColSolution: {
    width: "450px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    wordWrap: 'break-word', // Ensure long texts are wrapped
  },
  tableColDays: {
    width: "120px",
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
    width: 250,
    height: 70,
    alignSelf: 'center',
  },
  footerText: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 10,
  }
});

const headers = ['Call ID', 'Employee', 'Problem', 'Customer', 'Phone Number', 'Start Time', 'End Time', 'Duration']

interface Props {
    data: CallTimesResponse,
    starttime: string,
    endtime: string,
}

export const CustomerCallTimesPDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toString().split(' ').slice(1, 5).join(' ');
  const endTimeFormatted = new Date(endtime).toString().split(' ').slice(1, 5).join(' ');

  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Image style={styles.image} src="/covers/legendSystems.png" />
        <Text style={styles.header}>Customer Call Times Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text> {/* Added info text with formatted date and time */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColCustomer, styles.tableColHeader]}>
              <Text>Customer</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>No. Calls</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>Average Time</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>Total</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColCustomer]}>
                <Text>{row.Customer}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text>{row.CallCount}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text>{row.AverageTime}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text>{row.TotalHours}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.footerText}>Call Times</Text> {/* Added footer text */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

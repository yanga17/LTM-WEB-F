'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer'
import { CallHistoryResponse } from '../../modules/reports/customerCallHistoryModule'

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
    width: "150px",
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
  }
});


interface Props {
    data: CallHistoryResponse,
    starttime: string,
    endtime: string
}

export const CallHistoryPDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toLocaleString();
  const endTimeFormatted = new Date(endtime).toLocaleString();

  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Text style={styles.header}>Customer Call History Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColCustomer, styles.tableColHeader]}>
              <Text>Customer</Text>
            </View>
            <View style={[styles.tableColActivity, styles.tableColHeader]}>
              <Text>Activity</Text>
            </View>
            <View style={[styles.tableColComments, styles.tableColHeader]}>
              <Text>Comments</Text>
            </View>
            <View style={[styles.tableColStartTime, styles.tableColHeader]}>
              <Text>Start Time</Text>
            </View>
            <View style={[styles.tableColEndTime, styles.tableColHeader]}>
              <Text>End Time</Text>
            </View>
            <View style={[styles.tableColDuration, styles.tableColHeader]}>
              <Text>Duration</Text>
            </View>
            <View style={[styles.tableColSolution, styles.tableColHeader]}>
              <Text>Solution</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColCustomer]}>
                <Text>{row.Customer}</Text>
              </View>
              <View style={[styles.tableColActivity]}>
                <Text>{row.Activity}</Text>
              </View>
              <View style={[styles.tableColComments]}>
                <Text>{row.Comments}</Text>
              </View>
              <View style={[styles.tableColStartTime]}>
                <Text>{new Date(row.StartTime).toLocaleString()}</Text>
              </View>
              <View style={[styles.tableColEndTime]}>
                <Text>{new Date(row.EndTime).toLocaleString()}</Text>
              </View>
              <View style={[styles.tableColDuration]}>
                <Text>{row.Duration}</Text>
              </View>
              <View style={[styles.tableColSolution]}>
                <Text>{row.Solution}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

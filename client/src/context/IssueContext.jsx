import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Pothole on Main St',
      category: 'Pothole',
      location: '123 Main St',
      description: 'Large pothole causing traffic issues',
      status: 'Pending',
      date: '2023-05-15',
      image: null
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      category: 'Streetlight',
      location: '456 Oak Ave',
      description: 'Streetlight not working for 3 days',
      status: 'In Process',
      date: '2023-05-16',
      image: null
    }
  ]);

  const addIssue = (newIssue) => {
    const issue = {
      ...newIssue,
      id: Date.now(),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setIssues([...issues, issue]);
    return issue;
  };

  const updateIssueStatus = async (id, status) => {
    try {
      const { data } = await axios.post('/api/user/update-status', { id, status });
      if (data.success) {
        // Update local state
        setIssues(prevIssues => prevIssues.map(issue =>
          (issue.id === id || issue._id === id) ? { ...issue, status } : issue
        ));
        return true;
      }
    } catch (error) {
      console.error("Failed to update status", error);
      return false;
    }
  };


  return (
    <IssueContext.Provider value={{ issues, addIssue, updateIssueStatus }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  return useContext(IssueContext);
};

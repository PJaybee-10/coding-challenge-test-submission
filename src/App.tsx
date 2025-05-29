import React, { useState } from "react";

import Address from "./ui/components/Address/Address";
import AddressBook from "./ui/components/AddressBook/AddressBook";
import Button from "./ui/components/Button/Button";
import ErrorMessage from "./ui/components/ErrorMessage/ErrorMessage";
import Form from "./ui/components/Form/Form";
import InputText from "./ui/components/InputText/InputText";
import Radio from "./ui/components/Radio/Radio";
import Section from "./ui/components/Section/Section";
import useAddressBook from "./ui/hooks/useAddressBook";
import useForm from "./hooks/useForm";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Using the custom form hook to manage form fields
   */
  const { values, handleChange, resetForm } = useForm({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: ""
  });

  /**
   * Results states
   */
  const [error, setError] = useState<undefined | string>(undefined);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);
  /**
   * Redux actions
   */
  const { addAddress, removeAddress } = useAddressBook();

  /**
   * Helper to clear all form data and reset state
   */
  const handleClearAll = () => {
    resetForm();
    setAddresses([]);
    setError(undefined);
  };

  /** Fetches addresses based on houseNumber and postCode */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous results and errors
    setError(undefined);
    setAddresses([]);
    
    // Validate form fields
    if (!values.postCode || !values.houseNumber) {
      setError("Postcode and house number fields are mandatory!");
      return;
    }
    
    // Start loading
    setLoading(true);
    
    try {
      // Use window.location.origin as the base URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/getAddresses?postcode=${values.postCode}&streetnumber=${values.houseNumber}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "error") {
        setError(data.errormessage);
      } else if (data.details && data.details.length > 0) {
        // Transform addresses to include house number
        const transformedAddresses = data.details.map((address: any) => ({
          ...address,
          houseNumber: values.houseNumber
        }));
        
        setAddresses(transformedAddresses);
      } else {
        setError("No addresses found");
      }
    } catch (error) {
      setError("An error occurred while fetching addresses");
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Validates and submits personal info */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    // Validate first name and last name
    if (!values.firstName || !values.lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!values.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === values.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: values.firstName, lastName: values.lastName });
    
    // Clear form after successful submission
    resetForm();
    setAddresses([]);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: values.postCode,
                onChange: handleChange,
                required: true
              }
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: values.houseNumber,
                onChange: handleChange,
                required: true
              }
            }
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
                checked={values.selectedAddress === address.id}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {values.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: values.firstName,
                  onChange: handleChange,
                  required: true
                }
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: values.lastName,
                  onChange: handleChange,
                  required: true
                }
              }
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleClearAll}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;

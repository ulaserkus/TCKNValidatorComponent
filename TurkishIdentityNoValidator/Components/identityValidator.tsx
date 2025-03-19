import React, { useState, useEffect } from 'react';
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { TextField, PrimaryButton, Stack, Label, MessageBar, MessageBarType } from '@fluentui/react';

interface IdentityValidatorProps {
  context: ComponentFramework.Context<IInputs>;
  tckn: string;
  name: string;
  surname: string;
  birthYear: string;
  onChange: (fieldName: string, value: string) => void;
}

const IdentityValidator: React.FC<IdentityValidatorProps> = ({ context, tckn, name, surname, birthYear, onChange }) => {
  const [tcKimlikNo, setIdentityNumber] = useState(tckn);
  const [ad, setFirstName] = useState(name);
  const [soyad, setLastName] = useState(surname);
  const [dogumYili, setBirthYear] = useState(birthYear);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    onChange("tckn", tcKimlikNo);
  }, [tcKimlikNo, onChange]);

  useEffect(() => {
    onChange("name", ad);
  }, [ad, onChange]);

  useEffect(() => {
    onChange("surname", soyad);
  }, [soyad, onChange]);

  useEffect(() => {
    onChange("birthYear", dogumYili);
  }, [dogumYili, onChange]);

  const handleTcKimlikNoChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setIdentityNumber(newValue || '');
  };

  const onNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setFirstName(newValue || '');
  };

  const onLastNameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setLastName(newValue || '');
  };

  const onBirthYearChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setBirthYear(newValue || '');
  };

  const handleSubmit = async () => {
    try {
      const request = {
        tckn: tcKimlikNo,
        surname: soyad,
        name: ad,
        birthYear: dogumYili,
        getMetadata: function () {
          return {
            boundParameter: null,
            parameterTypes: {
              tckn: { typeName: "Edm.String", structuralProperty: 1 },
              surname: { typeName: "Edm.String", structuralProperty: 1 },
              name: { typeName: "Edm.String", structuralProperty: 1 },
              birthYear: { typeName: "Edm.String", structuralProperty: 1 }
            },
            operationType: 0,
            operationName: "uls_TCKNValidateAction"
          };
        }
      };

      const anyWebApi = context.webAPI as any;
      const response = await anyWebApi.execute(request);
      const result = await response.json() as TCKNValidateActionResponse;
      setResult(result.isValid 
        ? 'Kimlik doğrulama başarılı.' 
        : `Kimlik doğrulama başarısız: ${result.errorMessage || 'Geçersiz kimlik numarası veya bilgileri.'}`);
    } catch (error) {
      setResult('Kimlik doğrulama sırasında hata oluştu.');
    }
  };

  return (
    <div style={{ width: '300px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Label style={{ textAlign: 'center', fontWeight: 'bold' }}>Kimlik Doğrulama</Label>
        <TextField label="T.C. Kimlik No" value={tcKimlikNo} onChange={handleTcKimlikNoChange} />
        <TextField label="Ad" value={ad} onChange={onNameChange} />
        <TextField label="Soyad" value={soyad} onChange={onLastNameChange} />
        <TextField label="Doğum Yılı" value={dogumYili} onChange={onBirthYearChange} />
        <PrimaryButton text="Doğrula" onClick={handleSubmit} />
        {result && (
          <MessageBar messageBarType={result.includes('başarılı') ? MessageBarType.success : MessageBarType.error}>
            {result}
          </MessageBar>
        )}
      </Stack>
    </div>
  );
};

export default IdentityValidator;
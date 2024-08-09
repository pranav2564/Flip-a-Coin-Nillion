import React, { useEffect, useState } from "react";
import GenerateUserKey from "./nillion/components/GenerateUserKey";
import CreateClient from "./nillion/components/CreateClient";
import * as nillion from "@nillion/client-web";

import { NillionClient, NadaValues } from "@nillion/client-web";
import StoreSecretForm from "./nillion/components/StoreSecretForm";
import StoreProgram from "./nillion/components/StoreProgramForm";
import ComputeForm from "./nillion/components/ComputeForm";
import ConnectionInfo from "./nillion/components/ConnectionInfo";
import { Box, Button, Typography } from "@mui/material";

export default function Main() {
  const programName = 'coin_flip';
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] = useState<nillion.NadaValues | null>(null);
  const [computeResult, setComputeResult] = useState<any | null>(null);
  const [user1Call, setUser1Call] = useState<string>('');
  const [user2Call, setUser2Call] = useState<string>('');

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      setPartyId(client.party_id);
      const additionalComputeValues = new nillion.NadaValues();
      setAdditionalComputeValues(additionalComputeValues);
    }
  }, [userkey, client]);

  const handleCompute = (result: any) => {
    setComputeResult(result);
  };

  const resetGame = () => {
    setComputeResult(null);
    setUser1Call('');
    setUser2Call('');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Coin Flip Demo</Typography>
      <Typography variant="body1" paragraph>
        Connect to Nillion with a user key, then follow the steps to store the
        program, make your calls, and compute the result.
      </Typography>
      <ConnectionInfo client={client} userkey={userkey} />

      <Typography variant="h5" gutterBottom>1. Connect to Nillion Client {client && " ✅"}</Typography>
      <GenerateUserKey setUserKey={setUserKey} />

      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}
      
      <Box my={3}>
        <Typography variant="h5" gutterBottom>2. Store Program {programId && " ✅"}</Typography>
        {client && (
          <StoreProgram
            nillionClient={client}
            defaultProgram={programName}
            onNewStoredProgram={(program) => setProgramId(program.program_id)}
          />
        )}
      </Box>
      
      <Box my={3}>
        <Typography variant="h5" gutterBottom>3. Make Your Calls {user1Call && user2Call && " ✅"}</Typography>
        {userId && programId && (
          <>
            <StoreSecretForm
              secretName={"user1_call"}
              onNewStoredSecret={(secret) => setUser1Call(secret.storeId)}
              nillionClient={client}
              secretType="SecretInteger"
              isLoading={false}
              itemName=""
              hidePermissions
              defaultUserWithComputePermissions={userId}
              defaultProgramIdForComputePermissions={programId}
            />
            <StoreSecretForm
              secretName={"user2_call"}
              onNewStoredSecret={(secret) => setUser2Call(secret.storeId)}
              nillionClient={client}
              secretType="SecretInteger"
              isLoading={false}
              itemName=""
              hidePermissions
              defaultUserWithComputePermissions={userId}
              defaultProgramIdForComputePermissions={programId}
            />
          </>
        )}
      </Box>

      <Box my={3}>
        <Typography variant="h5" gutterBottom>4. Compute {computeResult && " ✅"}</Typography>
        {client &&
          programId &&
          user1Call &&
          user2Call &&
          partyId &&
          additionalComputeValues && (
            <ComputeForm
              nillionClient={client}
              programId={programId}
              additionalComputeValues={additionalComputeValues}
              storeIds={[user1Call, user2Call]}
              inputParties={[
                { partyName: "Party1", partyId },
                { partyName: "Party2", partyId }
              ]}
              outputParties={[
                { partyName: "Party1", partyId },
                { partyName: "Party2", partyId }
              ]}
              outputName="coin_flip_result"
              onComputeProgram={handleCompute}
            />
          )}
      </Box>
      
      {computeResult && (
        <Box my={3}>
          <Typography variant="h6" gutterBottom>Results:</Typography>
          <Typography>Coin Flip Result: {computeResult.value.coin_flip_result === '0' ? 'Heads' : 'Tails'}</Typography>
          <Typography>Party1 {computeResult.value.user1_won === '1' ? 'Won!' : 'Lost.'}</Typography>
          <Typography>Party2 {computeResult.value.user2_won === '1' ? 'Won!' : 'Lost.'}</Typography>
          <Button variant="contained" onClick={resetGame} sx={{ mt: 2 }}>Flip Again</Button>
        </Box>
      )}
    </Box>
  );
}
from nada_dsl import *

def nada_main():
    # Define parties
    party1 = Party(name="Party1")
    party2 = Party(name="Party2")
    
    # Input from each party
    user1_call = SecretInteger(Input(name="user1_call", party=party1))  # 0 for heads, 1 for tails
    user2_call = SecretInteger(Input(name="user2_call", party=party2))  # 0 for heads, 1 for tails

    # Generate a random coin flip result (0 or 1)
    coin_flip = SecretInteger.random() % Integer(2)

    # Determine if each party guessed correctly
    user1_won = (user1_call == coin_flip).if_else(Integer(1), Integer(0))
    user2_won = (user2_call == coin_flip).if_else(Integer(1), Integer(0))

    # Outputs
    return [
        Output(coin_flip, "coin_flip_result", party1),
        Output(coin_flip, "coin_flip_result", party2),
        Output(user1_won, "user1_won", party1),
        Output(user2_won, "user2_won", party2)
    ]

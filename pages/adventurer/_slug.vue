<template>
  <section>
    <div v-if="!$fetchState.pending">
      <h4 class="text-gray-400">adventurer</h4>
      <h1>{{ shortenHash(slug) }}</h1>
      <h3>
        <span class="text-2xl">
          <span v-if="usersGold" class="text-yellow-400">{{ usersGold }}</span>
          <span v-else>...</span>
          Adventurers Gold</span
        >
        <br />
        <span class="text-xl text-gray-400"
          >${{
            (usersGold * goldPrice)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }}
          USD
        </span>
      </h3>
      <div
        class="
          bg-black
          sticky
          top-10
          z-10
          rounded
          px-4
          py-2
          space-x-6
          border-white
          w-auto
          border
        "
      >
        <a
          v-if="adventurer.wallet.bagsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#loot"
          >Loot: {{ adventurer.wallet.bagsHeld }}
        </a>
        <a
          v-if="adventurer.wallet.realmsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#realms"
          >Realms: {{ adventurer.wallet.realmsHeld }}</a
        >
        <a
          v-if="adventurer.wallet.treasuresHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#treasure"
          >Treasure: {{ adventurer.wallet.treasuresHeld }}</a
        >
        <a
          v-if="adventurer.wallet.mLootHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mloot"
          >mLoot: {{ adventurer.wallet.mLootHeld }}</a
        >
      </div>
      <div v-if="adventurer.bags.length" id="loot">
        <h3 class="mt-8">Loot: {{ adventurer.wallet.bagsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(loot, index) in adventurer.bags"
            :key="index"
            class="w-80"
          >
            <LootCard is-o-g :loot="loot">
              <div class="flex">
                Score:
                <span v-if="rariety" class="ml-auto">{{
                  lootRariety(loot.id).score
                }}</span>
                <div
                  v-else
                  class="h-6 w-10 bg-white rounded animate-pulse ml-2"
                ></div>
              </div>
              <div class="flex">
                <span>Rank: </span>

                <span v-if="rariety" class="ml-auto">{{
                  lootRariety(loot.id).rarest
                }}</span>
                <div
                  v-else
                  class="h-6 w-10 bg-white rounded animate-pulse ml-2"
                ></div>
              </div>
            </LootCard>
          </div>
        </div>
      </div>

      <div v-if="adventurer.realms.length" id="realms">
        <hr />
        <div v-if="openSeaData.length">
          <h3 class="mt-8">Realms: {{ adventurer.wallet.realmsHeld }}</h3>
          <div class="flex flex-wrap w-full">
            <div v-for="realm in sortedRealms" :key="realm.id" class="w-80">
              <RealmCard :id="realm.token_id" :realm="realm">
                <div class="relative">
                  <img
                    v-if="realm.image_url"
                    class="rounded-xl p-1"
                    :src="realm.image_url"
                  />
                  <div
                    v-else
                    class="
                      bg-gray-100
                      text-black
                      p-2
                      rounded
                      flex
                      self-center
                      h-48
                      w-full
                      justify-between
                    "
                  >
                    no image yet
                  </div>
                  <RealmRarity
                    class="absolute top-10 right-10"
                    :traits="realm.traits"
                  />
                </div>

                <div class="p-2 flex flex-wrap text-xs">
                  <ResourceChip
                    v-for="(resource, index) in resources(realm.traits)"
                    :key="index"
                    class="mr-2 my-1"
                    :resource="resource"
                  />
                </div>
                <div
                  v-if="wonder(realm.traits)"
                  class="
                    px-2
                    text-center
                    border-white
                    rounded
                    py-1
                    border
                    mx-2
                    mb-2
                  "
                >
                  {{ wonder(realm.traits).value }}
                </div>
                <div class="px-4">
                  <h4>{{ realm.name }} - #{{ realm.token_id }}</h4>
                  <h6 class="text-gray-500">
                    Realm sales: {{ realm.num_sales }}
                  </h6>
                </div>
              </RealmCard>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap mt-4">
          <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
        </div>
      </div>
      <div v-else class="flex flex-wrap mt-4">
        <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
      </div>
      <div v-if="adventurer.treasures.length" id="treasure">
        <hr />
        <h3 class="mt-8">Treasure: {{ adventurer.wallet.treasuresHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="treasure in adventurer.treasures"
            :key="treasure.id"
            class="w-80"
          >
            <TreasureCard :treasure="treasure" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.mloots.length" id="mloot">
        <hr />
        <h3 class="mt-8">mLoot: {{ adventurer.wallet.mLootHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="loot in adventurer.mloots" :key="loot.id" class="w-80">
            <LootCard :loot="loot" />
          </div>
        </div>
      </div>
    </div>
    <Loader v-else />
  </section>
</template>

<script>
import { gql } from 'nuxt-graphql-request'
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { Contract, ethers } from 'ethers'
import { useFormatting } from '~/composables/useFormatting'
import GoldAbi from '~/abi/gold.json'
import { usePrice, useRarity } from '~/composables'
export default defineComponent({
  setup(props, context) {
    const { $graphql } = useContext()
    const { checkRealmRarity } = useRarity()
    const { goldPrice } = usePrice()
    const { shortenHash } = useFormatting()
    const { slug } = context.root.$route.params
    const variables = ref({ slug })
    const adventurer = ref(null)
    const usersGold = ref(null)
    const goldTokenAddress = '0x32353A6C91143bfd6C7d363B546e62a9A2489A20'

    const query = ref(gql`
      query userSlug($slug: String!) {
        wallet(id: $slug) {
          realmsHeld
          bagsHeld
          treasuresHeld
          mLootHeld
        }
        realms(first: 30, where: { currentOwner: $slug }) {
          id
          tokenURI
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        treasures(first: 30, where: { currentOwner: $slug }) {
          id
          asset1
          asset2
          asset3
          asset4
          asset5
          asset6
          asset7
          asset8
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        bags(first: 30, where: { currentOwner: $slug }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        mloots(first: 30, where: { currentOwner: $slug }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
      }
    `)

    // eslint-disable-next-line
    const provider = new ethers.getDefaultProvider('mainnet', {
      etherscan: process.env.ETHER_SCAN,
      alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      infura: process.env.INFURA_ID,
    })

    const options = {
      address: slug,
      provider,
    }

    const getBalance = async (options) => {
      const contract = new Contract(goldTokenAddress, GoldAbi, options.provider)
      const balance = await contract.balanceOf(options.address)
      return ethers.utils.formatEther(balance)
    }

    onMounted(async () => {
      usersGold.value = await getBalance(options)
      openSeaFetch()
      rarietyFetch()
    })

    useFetch(async () => {
      adventurer.value = await $graphql.default.request(
        query.value,
        variables.value
      )
    })

    const openSeaData = ref([])
    const loading = ref()
    const offset = ref(0)
    const openSeaFetch = async (off) => {
      loading.value = true
      const numPages = Math.ceil(adventurer.value.wallet.realmsHeld / 50)

      for (let page = 0; page < numPages; page++) {
        try {
          const response = await axios.get(
            'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50&owner=' +
              slug +
              '&offset=' +
              page * 50
          )
          openSeaData.value = openSeaData.value.concat(response.data.assets)
        } catch (e) {
          console.log(e)
        } finally {
          loading.value = false
        }
      }
    }

    const realmOpenSea = (id) => {
      return openSeaData.value.find((realm) => realm.token_id === id)
    }

    const rariety = ref(null)

    const rarietyFetch = async () => {
      const idString = adventurer.value
        ? adventurer.value.bags
            .map((bag) => {
              return 'id=' + bag.id + '&'
            })
            .join('')
            .slice(0, -1)
        : ''

      if (idString !== '') {
        try {
          const response = await axios.get('/api/rare?' + idString)
          rariety.value = response.data
        } catch (e) {
          console.log(e)
        }
      }
    }

    const lootRariety = (id) => {
      return rariety.value.find((loot) => loot.id.toString() === id)
    }

    const resources = (traits) => {
      return traits.filter((resource) => resource.trait_type === 'Resource')
    }

    const wonder = (traits) => {
      return traits.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }

    const sortedRealms = computed(() => {
      return openSeaData.value
        ? openSeaData.value.sort((a, b) => {
            return checkRealmRarity(b.traits) - checkRealmRarity(a.traits)
          })
        : null
    })

    return {
      adventurer,
      slug,
      shortenHash,
      goldPrice,
      usersGold,
      openSeaData,
      loading,
      realmOpenSea,
      rariety,
      lootRariety,
      resources,
      wonder,
      sortedRealms,
      offset,
    }
  },
})
</script>

namespace automata.sim.automata
{
    public class Pair<K, V>
    {
        private K key;
        private V value;

        public Pair(K key, V value)
        {
            this.key = key;
            this.value = value;
        }

        public K GetKey()
        {
            return key;
        }

        public void SetKey(K key)
        {
            this.key = key;
        }

        public V GetValue()
        {
            return value;
        }

        public void SetValue(V value)
        {
            this.value = value;
        }

        public override string ToString()
        {
            return "(" + key + ", " + value + ")";
        }
    }
}

